import { client } from '@config/urql'

const DOES_FOLLOW = `
  query($request: DoesFollowRequest!) {
    doesFollow(request: $request) { 
			followerAddress
    	profileId
    	follows
		}
  }
`

export async function doesFollow(followInfos: { followerAddress: string; profileId: string }[]) {
  const follow = await client
    .query(DOES_FOLLOW, {
      request: {
        followInfos,
      },
    })
    .toPromise()
  return follow
}

export default doesFollow
