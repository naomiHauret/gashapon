import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = `
  mutation($request: CreateSetDefaultProfileRequest!) { 
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
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
          wallet
          profileId
        }
      }
    }
 }
`

export async function setDefaultProfile(request) {
  await login()
  const newDefaultProfile = await client
    .mutation(CREATE_SET_DEFAULT_PROFILE_TYPED_DATA, {
      request,
    })
    .toPromise()

  return newDefaultProfile
}

export default setDefaultProfile
