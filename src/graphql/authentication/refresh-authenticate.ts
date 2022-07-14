import { client } from '@config/urql'

const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export async function refreshAuthenticate(refreshToken) {
  const refreshed = await client
    .mutation(REFRESH_AUTHENTICATION, {
      request: {
        refreshToken,
      },
    })
    .toPromise()

  return refreshed
}

export default refreshAuthenticate
