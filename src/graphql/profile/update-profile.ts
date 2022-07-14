import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const SET_PROFILE_METADATA_TYPED_DATA = `
  mutation($request: CreatePublicSetProfileMetadataURIRequest!) { 
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
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
          metadata
        }
      }
    }
  }
`

export async function updateProfileMetadata(request) {
  await login()
  const updated = await client
    .mutation(SET_PROFILE_METADATA_TYPED_DATA, {
      request,
    })
    .toPromise()

  return updated
}

export default updateProfileMetadata
