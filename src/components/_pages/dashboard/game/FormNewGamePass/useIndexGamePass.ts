import { string, object, boolean, number } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createUniqueId } from 'solid-js'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useSkynet from '@hooks/useSkynet'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import omit from '@helpers/omit'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { v4 as uuidv4 } from 'uuid'
import { createPublicationTypedData } from '@graphql/publications/create'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'
import { PORTAL } from '@config/skynet'
import { login } from '@graphql/authentication/login'
import { useAccount } from '@hooks/useAccount'
import { whitelist } from '@helpers/tokens'
import useNetwork from '@hooks/useNetwork'

const schema = object({
  followersOnly: boolean(),
  isLimitedCollectAmount: boolean(),
  collectAmountLimit: number().positive().or(string().max(0)),
  isLimitedCollectDatetime: boolean(),
  hasCollectFee: boolean(),
  collectFeeAmount: number().nonnegative().or(string().max(0)),
  collectFeeCurrencyAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  hasReferralFee: boolean(),
  referralFeeAmount: number().nonnegative().or(string().max(0)),
  recipientAddress: string().regex(/^0x[a-fA-F0-9]{40}$/),
})

const useStoreUploadNewGamePassData = createAsyncStore()
const useStoreIndexGamePassData = createAsyncStore()

export function useIndexGamePassData(game) {
  const { accountData } = useAccount()
  const { networkData } = useNetwork()
  const [stateDialogModalTrackProgress, sendDialogModalTrackProgress] = useMachine(
    dialog.machine({
      role: 'alertdialog',
      closeOnOutsideClick: false,
      closeOnEsc: false,
      preventScroll: true,

      id: createUniqueId(),
    }),
  )

  const apiDialogModalTrackProgress = createMemo(() =>
    dialog.connect(stateDialogModalTrackProgress, sendDialogModalTrackProgress, normalizeProps),
  )

  //@ts-ignore
  const { uploadData, setDataLink, getEntryLink } = useSkynet()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const toast = useToast()
  const stateUploadNewGamePassData = useStoreUploadNewGamePassData()
  const stateIndexGamePassData = useStoreIndexGamePassData()

  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()

  // Form
  const storeForm = createForm({
    onSubmit: async (values) => {
      await updateGamePassMetadata(values)
    },
    initialValues: {
      collectAmountLimit: '',
      collectFeeAmount: '',
      referralFeeAmount: '',
      collectFeeCurrencyAddress: '',
      recipientAddress: accountData()?.address,
      followersOnly: false,
      isLimitedCollectAmount: false,
      isLimitedCollectDatetime: false,
      hasCollectFee: true,
      hasReferralFee: false,
    },
    extend: validator({ schema }),
  })

  async function uploadGamePassData(jsonFile) {
    stateUploadNewGamePassData.setIsLoading(true)
    try {
      const url = await uploadData({
        file: jsonFile,
        silentUpload: true,
      })
      stateUploadNewGamePassData.setIsSuccess(true)
      stateUploadNewGamePassData.setIsLoading(false)
      stateUploadNewGamePassData.setError(null, false)
      return url
    } catch (e) {
      console.error(e)
      stateIndexGamePassData.setIsLoading(false)
      stateIndexGamePassData.setIsSuccess(false)
      stateIndexGamePassData.setError(e?.message ?? e, true)
      stateUploadNewGamePassData.setIsSuccess(false)
      stateUploadNewGamePassData.setIsLoading(false)
      stateUploadNewGamePassData.setError(e?.message ?? e, true)
    }
  }

  async function updateGamePassMetadata(values) {
    stateIndexGamePassData.setIsLoading(true)
    stateIndexGamePassData.setError(null, false)
    apiDialogModalTrackProgress().open()
    const uuid = uuidv4().replace('-', '')
    try {
      await login()

      const gameMetadata = {
        appId: LENS_PUBLICATIONS_APP_ID_GAMES_STORE,
        description: `Grant access to ${game.title} file on Gashapon.`,
        content: `Game pass for ${game.title}`,
        name: `${game.title} - game pass`,
        image: game.banner,
        mainContentFocus: 'ARTICLE',
        tags: ['gamePass', 'gashapon', `${game.id.replace('-', '')}`],
        locale: 'en-US',
        attributes: [
          {
            displayType: 'string',
            value: game.id.replace('-', ''),
            traitType: 'game-id',
          },
        ],
        version: '2.0.0',
        metadata_id: uuid,
      }

      const gameDataJSON = new File(
        [JSON.stringify(gameMetadata)],
        `gashapon-gamepass-${game.id}-${uuid}-${stateFetchDefaultProfile.data.id}.json`,
        { type: 'application/json' },
      )
      const metadataUrl = await uploadGamePassData(gameDataJSON)
      const dataKey = uuid
      const skylink = metadataUrl.skylink

      // set a registry entry to point at 'skylink'
      await setDataLink(dataKey, skylink)

      // get the resolver skylink which references the registry entry
      const resolverSkylink = await getEntryLink(stateFetchDefaultProfile.data.id, dataKey)

      let collectModule = {}

      const feeCollectParams = {
        amount: {
          currency: values?.collectFeeCurrencyAddress ?? whitelist[networkData()?.chain?.id].wMATIC,
          value: `${values?.collectFeeAmount}` ?? '0',
        },
        recipient: values?.recipientAddress,
        referralFee: values?.hasReferralFee && values?.hasReferralFee !== '' ? values.referralFeeAmount : 0,
        followerOnly: values?.followersOnly,
      }

      if (values.isLimitedCollectDatetime) {
        if (values.isLimitedCollectAmount) {
          collectModule.limitedTimedFeeCollectModule = {
            collectLimit: `${values.collectAmountLimit}`,
            ...feeCollectParams,
          }
        } else {
          collectModule.timedFeeCollectModule = {
            ...feeCollectParams,
          }
        }
      }

      if (values.isLimitedCollectAmount) {
        collectModule.limitedFeeCollectModule = {
          collectLimit: `${values.collectAmountLimit}`,
          ...feeCollectParams,
        }
      }

      if (!values.isLimitedCollectAmount && !values.isLimitedCollectDatetime) {
        collectModule.feeCollectModule = {
          ...feeCollectParams,
          followerOnly: values?.followersOnly,
        }
      }

      if (!values?.hasCollectFee || values.hasCollectFee === false) {
        collectModule.freeCollectModule = {
          followerOnly: values?.followersOnly,
        }
      }

      const newGamePassRequest = {
        profileId: stateFetchDefaultProfile.data.id,
        contentURI: `${PORTAL}/${resolverSkylink.replace('sia://', '')}`,
        collectModule,
        referenceModule: {
          followerOnlyReferenceModule: values?.followersOnly,
        },
      }
      const result = await createPublicationTypedData(newGamePassRequest)
      if (result?.data) {
        const typedData = result.data.createPostTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })
        const { v, r, s } = splitSignature(signature)
        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'postWithSig',
          args: {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          },
        })
        setCanStartCountdown(true)
        await pollUntilIndexed(tx.hash)
        setShowWaitMessage(false)
        setCanStartCountdown(false)
        stateIndexGamePassData.setIsSuccess(true)
        stateIndexGamePassData.setData(result.data)

        !apiDialogModalTrackProgress()?.isOpen &&
          //@ts-ignore
          toast().create({
            type: 'success',
            title: `Your game pass was created successfully!`,
          })
      } else {
        setShowWaitMessage(false)
        setCanStartCountdown(false)
        stateIndexGamePassData.setError(result.error.message, true)
        stateIndexGamePassData.setIsLoading(false)
        stateIndexGamePassData.setIsSuccess(false)
        !apiDialogModalTrackProgress()?.isOpen &&
          //@ts-ignore
          toast().create({
            type: 'error',
            title: `Something went wrong and your game pass couldn't be created: ${result.error.message}`,
          })
      }
    } catch (e) {
      setShowWaitMessage(false)
      setCanStartCountdown(false)
      stateIndexGamePassData.setError(e?.message ?? e, true)
      stateIndexGamePassData.setIsLoading(false)
      stateIndexGamePassData.setIsSuccess(false)
      !apiDialogModalTrackProgress()?.isOpen &&
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and we couldn't create your game pass: ${e?.message ?? e}`,
        })
      console.error(e)
    }
  }

  createEffect(() => {
    if (!apiDialogModalTrackProgress().isOpen) {
      setShowWaitMessage(false)
      setCanStartCountdown(false)

      stateUploadNewGamePassData.setIsLoading(false)
      stateUploadNewGamePassData.setIsSuccess(false)
      stateUploadNewGamePassData.setError(null, false)

      stateIndexGamePassData.setIsLoading(false)
      stateIndexGamePassData.setIsSuccess(false)
      stateIndexGamePassData.setError(null, false)
    }
  })

  return {
    storeForm,
    showWaitMessage,
    stateUploadNewGamePassData,
    stateIndexGamePassData,
    apiDialogModalTrackProgress,
  }
}

export default useIndexGamePassData
