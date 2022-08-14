import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import createFollowTypedData from '@graphql/follow/follow-request'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { createAsyncStore } from '@hooks/useAsync'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useToast from '@hooks/useToast'
import { signTypedData, writeContract } from '@wagmi/core'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useAccount from '@hooks/useAccount'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import { createEffect } from 'solid-js'

const useStoreFollowRequest = createAsyncStore()

export function useFollow() {
  const toast = useToast()
  const { accountData } = useAccount()
  const stateFollowRequest = useStoreFollowRequest()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()

  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()

  async function followProfile(profileToFollow) {
    stateFollowRequest.setIsLoading(true)
    stateFollowRequest.setError(null, false)
    const currentProfileId = stateFetchDefaultProfile.data.id
    let followProfileRequest
    if (profileToFollow.followModule === null) {
      followProfileRequest = [
        {
          profile: profileToFollow.id,
        },
      ]
    } else {
      switch (profileToFollow.followModule.type) {
        case 'ProfileFollowModule':
          followProfileRequest = [
            {
              profile: profileToFollow.id,
              followModule: {
                profileFollowModule: {
                  profileId: currentProfileId,
                },
              },
            },
          ]
          break
        case 'FeeFollowModule':
          followProfileRequest = [
            {
              profile: profileToFollow.id,
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: profileToFollow.followModule.amount.asset.address,
                    value: profileToFollow.followModule.amount.value,
                  },
                },
              },
            },
          ]
          break
      }
    }

    try {
      //@ts-ignore
      const result = await createFollowTypedData(followProfileRequest)

      if (result?.data) {
        const typedData = result.data.createFollowTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'followWithSig',
          args: {
            follower: accountData()?.address,
            profileIds: typedData.value.profileIds,
            datas: typedData.value.datas,
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
        stateFollowRequest.setIsSuccess(true)
        stateFollowRequest.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `You now follow ${profileToFollow.name}!`,
        })
      } else {
        stateFollowRequest.setError(result.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your request to follow ${profileToFollow.name} failed: ${result.error.message}`,
        })
      }
      stateFollowRequest.setIsLoading(false)
    } catch (e) {
      console.error(e)
      stateFollowRequest.setError(e?.message ?? e, true)
      stateFollowRequest.setIsLoading(false)
      stateFollowRequest.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and your request to follow ${profileToFollow.name} failed: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

  createEffect(() => {
    if (showWaitMessage() === true)
      //@ts-ignore
      toast().create({
        type: 'info',
        title: `Looks like indexing your changes is taking a bit of time, please wait a bit more or reload the page.`,
      })
  })

  return {
    followProfile,
    stateFollowRequest,
    showWaitMessage,
  }
}

export default useFollow
