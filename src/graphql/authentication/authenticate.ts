import { client } from '@config/urql'

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export async function authenticate(address, signature) {
  const authenticated = await client
    .mutation(AUTHENTICATION, {
      request: {
        address,
        signature,
      },
    })
    .toPromise()

  return authenticated
}

export default authenticate
