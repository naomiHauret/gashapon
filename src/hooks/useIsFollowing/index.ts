import { useAccount } from '@hooks/useAccount'
import { createAsyncStore } from '@hooks/useAsync'
import doesFollow from '@graphql/follow/does-follow'

const useStoreIsFollowing = createAsyncStore()
export function useIsFollowing() {
  //@ts-ignore
  const { accountData } = useAccount()
  const stateIsFollowingThisProfile = useStoreIsFollowing()

  async function checkIfIsFollowing(profileId) {
    stateIsFollowingThisProfile.setIsLoading(true)
    const followInfos = [
      {
        followerAddress: accountData().address,
        profileId,
      },
    ]

    const result = await doesFollow(followInfos)
    if (result?.data) {
      stateIsFollowingThisProfile.setData(result?.data.doesFollow)
      stateIsFollowingThisProfile.setError(null, false)
    } else {
      //@ts-ignore
      stateIsFollowingThisProfile.setError(result?.error, true)
    }
    stateIsFollowingThisProfile.setIsLoading(false)
    stateIsFollowingThisProfile.setDidFetch(true)
  }

  return {
    stateIsFollowingThisProfile,
    checkIfIsFollowing,
  }
}

export default useIsFollowing
