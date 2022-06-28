import { client } from '@config/urql'

const CREATE_BURN_PROFILE_TYPED_DATA = `
  mutation($request: BurnProfileRequest!) { 
    createBurnProfileTypedData(request: $request) {
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

export async function deleteProfile(request) {
  const deleted = await client
    .mutation(CREATE_BURN_PROFILE_TYPED_DATA, {
      request,
    })
    .toPromise()

  return deleted
}

export default deleteProfile
