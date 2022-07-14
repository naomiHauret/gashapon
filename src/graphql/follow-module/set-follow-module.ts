import { client } from '@config/urql'

const CREATE_SET_FOLLOW_MODULE_TYPED_DATA = `
  mutation($request: CreateSetFollowModuleRequest!) { 
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        followModule
        followModuleInitData
      }
     }
   }
 }
`

export async function createSetFollowModuleTypedData(setFollowModuleRequest) {
  const isSet = await client
    .mutation(CREATE_SET_FOLLOW_MODULE_TYPED_DATA, {
      request: setFollowModuleRequest,
    })
    .toPromise()

  return isSet
}

export default createSetFollowModuleTypedData
