import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createUniqueId } from 'solid-js'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import omit from '@helpers/omit'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { login } from '@graphql/authentication/login'
import { useAccount } from '@hooks/useAccount'
import createCollectTypedData from '@graphql/collect/create'

const useStoreIndexPurchaseGamePass = createAsyncStore()

export function usePurchaseGamePass() {
  const { accountData } = useAccount()
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
  const toast = useToast()
  const stateIndexPurchaseGamePass = useStoreIndexPurchaseGamePass()

  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()

  async function updateGamePassMetadata(publicationId) {
    stateIndexPurchaseGamePass.setIsLoading(true)
    stateIndexPurchaseGamePass.setError(null, false)
    apiDialogModalTrackProgress().open()
    try {
      await login()
      const collectRequest = {
        publicationId,
      }
      const result = await createCollectTypedData(collectRequest)
      if (result?.data) {
        const typedData = result.data.createCollectTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })
        const { v, r, s } = splitSignature(signature)
        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'collectWithSig',
          args: {
            collector: accountData()?.address,
            profileId: typedData.value.profileId,
            pubId: typedData.value.pubId,
            data: typedData.value.data,
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
        stateIndexPurchaseGamePass.setIsSuccess(true)
        stateIndexPurchaseGamePass.setData(result.data)

        !apiDialogModalTrackProgress()?.isOpen &&
          //@ts-ignore
          toast().create({
            type: 'success',
            title: `Your game pass was created successfully!`,
          })
      } else {
        setShowWaitMessage(false)
        setCanStartCountdown(false)
        stateIndexPurchaseGamePass.setError(result.error.message, true)
        stateIndexPurchaseGamePass.setIsLoading(false)
        stateIndexPurchaseGamePass.setIsSuccess(false)
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
      stateIndexPurchaseGamePass.setError(e?.message ?? e, true)
      stateIndexPurchaseGamePass.setIsLoading(false)
      stateIndexPurchaseGamePass.setIsSuccess(false)
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
      stateIndexPurchaseGamePass.setIsLoading(false)
      stateIndexPurchaseGamePass.setIsSuccess(false)
      stateIndexPurchaseGamePass.setError(null, false)
    }
  })

  return {
    updateGamePassMetadata,
    showWaitMessage,
    apiDialogModalTrackProgress,
    stateIndexPurchaseGamePass,
  }
}

export default usePurchaseGamePass
