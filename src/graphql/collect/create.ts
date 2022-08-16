import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const CREATE_COLLECT_TYPED_DATA = `
  mutation($request: CreateCollectRequest!) { 
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
        pubId
        data
      }
     }
   }
 }
`

export async function createCollectTypedData(createCollectTypedDataRequest) {
  await login()
  const success = await client
    .mutation(CREATE_COLLECT_TYPED_DATA, {
      request: createCollectTypedDataRequest,
    })
    .toPromise()

  return success
}

export default createCollectTypedData
