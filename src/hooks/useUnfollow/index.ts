import createUnfollowTypedData from '@graphql/follow/unfollow'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { createAsyncStore } from '@hooks/useAsync'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useToast from '@hooks/useToast'
import { signTypedData, fetchSigner } from '@wagmi/core'
import abiLensFollowNft from '@abis/lens-follow-nft-contract'
import useAccount from '@hooks/useAccount'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import { Contract } from 'ethers'
import { createEffect } from 'solid-js'

const useStoreUnfollowRequest = createAsyncStore()

export function useUnfollow() {
  const toast = useToast()
  const stateUnfollowRequest = useStoreUnfollowRequest()
  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()

  async function unfollowProfile(profileToUnfollow) {
    stateUnfollowRequest.setIsLoading(true)
    stateUnfollowRequest.setError(null, false)

    try {
      const result = await createUnfollowTypedData(profileToUnfollow.id)

      if (result?.data) {
        const signer = await fetchSigner()
        const typedData = result.data.createUnfollowTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const followNftContract = new Contract(typedData.domain.verifyingContract, abiLensFollowNft, signer)

        const sig = {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        }

        const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig)

        setCanStartCountdown(true)
        await pollUntilIndexed(tx.hash)
        setShowWaitMessage(false)
        stateUnfollowRequest.setIsSuccess(true)
        stateUnfollowRequest.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `You unfollowed ${profileToUnfollow.name}!`,
        })
      } else {
        stateUnfollowRequest.setError(result.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your request to unfollow ${profileToUnfollow.name} failed: ${result.error.message}`,
        })
      }
      stateUnfollowRequest.setIsLoading(false)
    } catch (e) {
      console.error(e)
      stateUnfollowRequest.setError(e?.message ?? e, true)
      stateUnfollowRequest.setIsLoading(false)
      stateUnfollowRequest.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and your request to unfollow ${profileToUnfollow.name} failed: ${e?.message ?? e}`,
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
    unfollowProfile,
    stateUnfollowRequest,
    showWaitMessage,
  }
}

export default useUnfollow
