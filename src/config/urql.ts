import { createClient } from 'urql'
import { COOKIE_ACCESS_TOKENS } from '@config/storage'
import Cookies from 'js-cookie'
import { API_URL } from './lens'

export const client = createClient({
  url: API_URL,
  fetchOptions: () => {
    const token = Cookies.get(COOKIE_ACCESS_TOKENS)
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    }
  },
})
