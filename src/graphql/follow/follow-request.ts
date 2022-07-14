import { client } from '@config/urql'

const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
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
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`

export async function createFollowTypedData(followRequestInfo) {
  const success = await client
    .mutation(CREATE_FOLLOW_TYPED_DATA, {
      request: {
        follow: followRequestInfo,
      },
    })
    .toPromise()

  return success
}

export default createFollowTypedData
