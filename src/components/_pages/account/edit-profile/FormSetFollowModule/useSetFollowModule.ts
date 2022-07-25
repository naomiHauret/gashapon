import { createAsyncStore } from '@hooks/useAsync'
import { string, object, number } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useAccount from '@hooks/useAccount'
import createSetFollowModuleTypedData from '@graphql/follow-module/set-follow-module'
import omit from '@helpers/omit'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useToast from '@hooks/useToast'

export const FOLLOW_MODULE_TYPES = {
  FREE: 'free',
  FEE: 'fee',
  REVERT: 'revert',
  PROFILE: 'profile',
}

const schema = object({
  type: string(),
  feeCurrencyAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(string().max(0)),
  feeAmount: number().positive().or(string().max(0)),
})

const useStoreFollowModule = createAsyncStore()

export function useSetFollowModule() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const { showWaitMessage, setCanStartCountdown } = useIndexingTxWaitMessage()
  const stateSetFollowModule = useStoreFollowModule()
  const { accountData } = useAccount()
  const toast = useToast()
  const storeForm = createForm({
    initialValues: {
      type:
        stateFetchDefaultProfile.data.followModule === null
          ? FOLLOW_MODULE_TYPES.FREE
          : stateFetchDefaultProfile.data?.followModule?.type === 'FeeFollowModule'
          ? FOLLOW_MODULE_TYPES.FEE
          : stateFetchDefaultProfile.data?.followModule?.type === 'RevertFollowModule'
          ? FOLLOW_MODULE_TYPES.REVERT
          : stateFetchDefaultProfile.data?.followModule?.type === 'ProfileFollowModule'
          ? FOLLOW_MODULE_TYPES.PROFILE
          : null,
      feeCurrencyAddress: stateFetchDefaultProfile.data?.followModule?.amount?.asset?.address ?? '',
      feeAmount: parseFloat(stateFetchDefaultProfile.data?.followModule?.amount?.value) ?? '',
    },

    onSubmit: async (values) => {
      await setFollowModule(values)
    },
    extend: validator({ schema }),
  })

  async function setFollowModule(values) {
    const profileId = stateFetchDefaultProfile.data.id
    const setFollowModuleRequest = {
      profileId,
      followModule: {},
    }
    switch (values.type) {
      case FOLLOW_MODULE_TYPES.FEE:
        setFollowModuleRequest.followModule = {
          feeFollowModule: {
            amount: {
              currency: values.feeCurrencyAddress,
              value: `${values.feeAmount}`,
            },
            recipient: accountData().address,
          },
        }
        break
      case FOLLOW_MODULE_TYPES.FREE:
        setFollowModuleRequest.followModule = {
          freeFollowModule: true,
        }
        break
      case FOLLOW_MODULE_TYPES.REVERT:
        setFollowModuleRequest.followModule = {
          revertFollowModule: true,
        }
        break

      case FOLLOW_MODULE_TYPES.PROFILE:
        setFollowModuleRequest.followModule = {
          profileFollowModule: true,
        }
        break
    }
    stateSetFollowModule.setIsLoading(true)
    stateSetFollowModule.setError(null, false)

    try {
      const result = await createSetFollowModuleTypedData(setFollowModuleRequest)
      if (result?.data) {
        const typedData = result.data.createSetFollowModuleTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })
        const { v, r, s } = splitSignature(signature)
        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'setFollowModuleWithSig',
          args: {
            profileId: typedData.value.profileId,
            followModule: typedData.value.followModule,
            followModuleInitData: typedData.value.followModuleInitData,
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
        stateSetFollowModule.setIsSuccess(true)
        stateSetFollowModule.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `Your "follow" settings were updated successfully!`,
        })
      } else {
        stateSetFollowModule.setError(result.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your "follow" settings couldn't be updated\n: ${result.error.message}`,
        })
      }
      console.error(result.error.message)
      stateSetFollowModule.setIsLoading(false)
    } catch (e) {
      console.error(e)
      stateSetFollowModule.setIsLoading(false)
      stateSetFollowModule.setIsSuccess(false)
      stateSetFollowModule.setError(e?.message ?? e, true)
    }
  }

  return {
    storeForm,
    stateSetFollowModule,
    showWaitMessage,
  }
}
