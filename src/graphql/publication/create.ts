import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const CREATE_PUBLICATION_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`

export async function createPublicationTypedData(createPublicationTypedDataRequest) {
  await login()
  const success = await client
    .mutation(CREATE_PUBLICATION_TYPED_DATA, {
      request: createPublicationTypedDataRequest,
    })
    .toPromise()

  return success
}
