import { client } from '@config/urql'
const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`

export const verify = (accessToken) => {
  return client.query(VERIFY, {
    accessToken,
  })
}
