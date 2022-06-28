import { string, object } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import createProfile from '@graphql/profile/create-profile'
import useToast from '@hooks/useToast'
import useAccount from '@hooks/useAccount'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import { createEffect, createSignal } from 'solid-js'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'

const useStoreCreateProfile = createAsyncStore()

const schema = object({
  handle: string().trim().min(5),
})

export function useCreateProfile() {
  const toast = useToast()
  const stateCreateProfile = useStoreCreateProfile()
  const showWaitMessage = useIndexingTxWaitMessage(stateCreateProfile)
  const storeForm = createForm({
    onSubmit: async (values) => {
      await createUserProfile(values.handle)
    },
    extend: validator({ schema }),
  })

  async function createUserProfile(handle) {
    stateCreateProfile.setIsLoading(true)
    stateCreateProfile.setError(null, false)

    try {
      const claimedProfile = await createProfile({ handle: new Date().getTime().toString() })

      if (claimedProfile?.data) {
        await pollUntilIndexed(claimedProfile.data.createProfile.txHash)
        stateCreateProfile.setIsSuccess(true)
        stateCreateProfile.setData(claimedProfile.data)
        //@ts-ignore
        toast().create({
          type: 'success',
          title: `${handle}.lens was claimed successfully!`,
        })
      } else {
        console.error(claimedProfile.error)
        stateCreateProfile.setError(claimedProfile.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and ${handle}.lens couldn't be claimed.`,
        })
      }
      stateCreateProfile.setIsLoading(false)
    } catch (e) {
      stateCreateProfile.setError(e?.message ?? e, true)
      stateCreateProfile.setIsLoading(false)
      stateCreateProfile.setIsSuccess(false)

      console.error(e)
    }
  }

  return {
    storeForm,
    stateCreateProfile,
    showWaitMessage,
  }
}

export default useCreateProfile
