import { COOKIE_ACCESS_TOKENS } from '@config/storage'
import Cookies from 'js-cookie'
import getAuthToken from '@helpers/getAuthTokens'
import { getAccount, signMessage } from '@wagmi/core'
import { addMinutes } from 'date-fns'
import authenticate from './authenticate'
import generateChallenge from './generate-challenge'

export async function login() {
  if (getAuthToken()) {
    return
  }
  try {
    const { address } = await getAccount()
    const challengeResponse = await generateChallenge(address)
    const message = challengeResponse.data.challenge.text
    const signature = await signMessage(message)

    const accessTokens = await authenticate(address, signature)
    Cookies.set(COOKIE_ACCESS_TOKENS, accessTokens.data.authenticate.accessToken, {
      expires: addMinutes(new Date(), 30).toUTCString(),
      secure: true,
      httpOnly: true,
      SameSite: 'Strict',
      path: '/',
    })
    return accessTokens.data
  } catch (e) {
    console.error(e)
  }
}
