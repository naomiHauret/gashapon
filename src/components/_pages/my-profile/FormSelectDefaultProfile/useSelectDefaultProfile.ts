import { string, object } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import setDefaultProfile from '@graphql/profile/set-default-profile'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import omit from '@helpers/omit'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'

const useStoreSetDefaultProfile = createAsyncStore()

const schema = object({
  defaultAccount: string(),
})

export function useSelectDefaultProfile() {
  const toast = useToast()
  const stateSetDefaultProfile = useStoreSetDefaultProfile()
  const showWaitMessage = useIndexingTxWaitMessage(stateSetDefaultProfile)
  const storeForm = createForm({
    onSubmit: async (values) => {
      await setDefaultUserProfile(values.defaultAccount)
    },
    extend: validator({ schema }),
  })

  async function setDefaultUserProfile(defaultAccountId) {
    stateSetDefaultProfile.setIsLoading(true)
    stateSetDefaultProfile.setError(null, false)
    try {
      const newDefaultProfile = await setDefaultProfile({ profileId: defaultAccountId })

      if (newDefaultProfile?.data) {
        const typedData = newDefaultProfile.data.createSetDefaultProfileTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const tx = await writeContract(
          {
            addressOrName: CONTRACT_LENS_HUB_PROXY,
            contractInterface: abiLensHubProxy,
          },
          'setDefaultProfileWithSig',
          {
            args: {
              profileId: typedData.value.profileId,
              wallet: typedData.value.wallet,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
              },
            },
          },
        )

        await pollUntilIndexed(tx.hash)
        stateSetDefaultProfile.setIsSuccess(true)
        stateSetDefaultProfile.setData(newDefaultProfile.data)
        //@ts-ignore
        toast().create({
          type: 'success',
          title: `Your new default profile was set successfully!`,
        })
      } else {
        stateSetDefaultProfile.setError(newDefaultProfile.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your new default profile couldn't be set.`,
        })
      }
      stateSetDefaultProfile.setIsLoading(false)
    } catch (e) {
      stateSetDefaultProfile.setError(e?.message ?? e, true)
      stateSetDefaultProfile.setIsLoading(false)
      stateSetDefaultProfile.setIsSuccess(false)

      console.error(e)
    }
  }

  return {
    storeForm,
    stateSetDefaultProfile,
    showWaitMessage,
  }
}

export default useSelectDefaultProfile
