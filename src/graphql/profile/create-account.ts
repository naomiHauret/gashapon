import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const CREATE_PROFILE = `
  mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
			__typename
    }
 }
`

export async function createProfile(createProfileRequest) {
  await login()
  const created = await client
    .mutation(CREATE_PROFILE, {
      request: createProfileRequest,
    })
    .toPromise()

  return created
}

export default createProfile
