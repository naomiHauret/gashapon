import { client } from '@config/urql'

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`

export async function generateChallenge(address) {
  const challenge = await client
    .query(GET_CHALLENGE, {
      request: {
        address,
      },
    })
    .toPromise()
  return challenge
}

export default generateChallenge
