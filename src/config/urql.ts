import { createClient } from 'urql'

const APIURL = 'https://api.lens.dev/';

export const client = createClient({
  url: APIURL,
  /*
  fetchOptions: () => {
    const token = getToken()
    return token ? { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.packages-preview+json' }} : {}
  },
  */
})