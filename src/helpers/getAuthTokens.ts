import { COOKIE_ACCESS_TOKENS } from '@config/storage'
import Cookies from 'js-cookie'

export function getAuthToken() {
  return Cookies.get(COOKIE_ACCESS_TOKENS)
}

export default getAuthToken
