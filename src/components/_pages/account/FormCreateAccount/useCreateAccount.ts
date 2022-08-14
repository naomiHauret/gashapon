import { string, object } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import createProfile from '@graphql/profile/create-account'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'

const useStoreCreateAccount = createAsyncStore()

const schema = object({
  handle: string().trim().min(5),
})

export function useCreateAccount() {
  const toast = useToast()
  const stateCreateAccount = useStoreCreateAccount()
  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()
  const storeForm = createForm({
    onSubmit: async (values) => {
      await createUserProfile(values.handle)
    },
    extend: validator({ schema }),
  })

  async function createUserProfile(handle) {
    stateCreateAccount.setIsLoading(true)
    stateCreateAccount.setError(null, false)

    try {
      const claimedProfile = await createProfile({ handle })

      if (claimedProfile?.data) {
        setCanStartCountdown(true)
        await pollUntilIndexed(claimedProfile.data.createProfile.txHash)
        setShowWaitMessage(false)
        stateCreateAccount.setIsSuccess(true)
        stateCreateAccount.setData(claimedProfile.data)
        //@ts-ignore
        toast().create({
          type: 'success',
          title: `${handle}.lens was claimed successfully!`,
        })
      } else {
        console.error(claimedProfile.error)
        stateCreateAccount.setError(claimedProfile.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and ${handle}.lens couldn't be claimed: ${claimedProfile.error.message}`,
        })
      }
      stateCreateAccount.setIsLoading(false)
    } catch (e) {
      stateCreateAccount.setError(e?.message ?? e, true)
      stateCreateAccount.setIsLoading(false)
      stateCreateAccount.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and ${handle}.lens couldn't be claimed: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

  return {
    storeForm,
    stateCreateAccount,
    showWaitMessage,
  }
}

export default useCreateAccount
