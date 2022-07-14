import { client } from '@config/urql'

const CREATE_UNFOLLOW_TYPED_DATA = `
  mutation($request: UnfollowRequest!) { 
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
 }
`

export async function createUnfollowTypedData(profile) {
  const success = await client
    .mutation(CREATE_UNFOLLOW_TYPED_DATA, {
      request: {
        profile,
      },
    })
    .toPromise()

  return success
}

export default createUnfollowTypedData
