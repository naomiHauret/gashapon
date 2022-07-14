import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA = `
  mutation($request: UpdateProfileImageRequest!) { 
    createSetProfileImageURITypedData(request: $request) {
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
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
        	deadline
        	imageURI
        	profileId
        }
      }
    }
 }
`

export async function updateProfilePictureMetadata(request) {
  await login()
  const updated = await client
    .mutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA, {
      request,
    })
    .toPromise()

  return updated
}

export default updateProfilePictureMetadata
