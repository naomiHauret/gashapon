import { client } from '@config/urql'
import { login } from '@graphql/authentication/login'

const HIDE_PUBLICATION = `
  mutation($request: HidePublicationRequest!) { 
   hidePublication(request: $request)
 }
`

export async function deletePublication(publicationId: string) {
  await login()
  const success = await client
    .mutation(HIDE_PUBLICATION, {
      request: {
        publicationId,
      },
    })
    .toPromise()

  return success
}

export default deletePublication
