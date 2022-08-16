import { createAsyncStore } from '@hooks/useAsync'
import { deleteProfile } from '@graphql/profile/delete-account'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import { signTypedData, writeContract } from '@wagmi/core'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useToast from '@hooks/useToast'

const useStoreDeleteAccount = createAsyncStore()

export function useDeleteAccount() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const stateDeleteAccount = useStoreDeleteAccount()
  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()
  const toast = useToast()

  async function deleteCurrentAccount() {
    const accountToDeleteHandle = stateFetchDefaultProfile.data.handle
    const accountToDeleteId = stateFetchDefaultProfile.data.id

    stateDeleteAccount.setIsLoading(true)
    stateDeleteAccount.setError(null, false)
    try {
      const deletedResult = await deleteProfile({ profileId: accountToDeleteId })

      if (deletedResult?.data) {
        const typedData = deletedResult.data.createBurnProfileTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'burnWithSig',
          args: [
            typedData.value.tokenId,
            {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          ],
        })
        setCanStartCountdown(true)
        await pollUntilIndexed(tx.hash)
        setShowWaitMessage(false)
        setCanStartCountdown(false)
        stateDeleteAccount.setIsSuccess(true)
        stateDeleteAccount.setData(deletedResult.data)
        //@ts-ignore
        toast().create({
          type: 'success',
          title: `${accountToDeleteHandle} was deleted successfully!`,
        })
      } else {
        setShowWaitMessage(false)
        setCanStartCountdown(false)

        stateDeleteAccount.setError(deletedResult.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and ${accountToDeleteHandle} couldn't be deleted: ${deletedResult.error.message}`,
        })
        console.error(deletedResult.error.message)
      }
      stateDeleteAccount.setIsLoading(false)
    } catch (e) {
      setShowWaitMessage(false)
      setCanStartCountdown(false)

      stateDeleteAccount.setError(e?.message ?? e, true)
      stateDeleteAccount.setIsLoading(false)
      stateDeleteAccount.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and ${accountToDeleteHandle} couldn't be deleted: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

  return {
    stateDeleteAccount,
    deleteCurrentAccount,
    showWaitMessage,
  }
}
export default useDeleteAccount
