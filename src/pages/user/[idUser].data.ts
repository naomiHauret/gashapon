import { createResource } from 'solid-js'
import { getProfile } from '@graphql/profile/get-profile'
import { LENS_HANDLE_EXTENSION } from '@config/lens'

async function fetchUserData(handle) {
  const profile = await getProfile({ handle: `${handle}${LENS_HANDLE_EXTENSION}` })
  return profile
}

export function UserProfileData({ params }) {
  const [profile] = createResource(() => params.idUser, fetchUserData)
  return profile
}

export default UserProfileData
