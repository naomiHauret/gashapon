import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import Cookies from 'js-cookie'
import { API_URL } from './lens'
import { COOKIE_ACCESS_TOKENS } from './storage'

export const client = createClient({
  url: API_URL,
  // - dedupExchange: deduplicates requests if we send the same queries twice
  // - cacheExchange: implements the default "document caching" behaviour
  // - fetchExchange: send our requests to the GraphQL API
  exchanges: [dedupExchange, cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = Cookies.get(COOKIE_ACCESS_TOKENS)
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    }
  },
})
