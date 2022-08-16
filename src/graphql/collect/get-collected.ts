import { client } from '@config/urql'

const GET_COLLECTED_BY_USER = `
query($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      walletAddress
      results {
        collected
        publicationId
        collectedTimes
      }
    }
  }`

export async function getCollectedByUser(collectRequests) {
  const collected = await client
    .query(GET_COLLECTED_BY_USER, {
      request: collectRequests,
    })
    .toPromise()
  return collected
}

export default getCollectedByUser
