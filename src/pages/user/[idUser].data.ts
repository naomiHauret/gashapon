import { createResource } from 'solid-js'
import { getProfile } from '@graphql/profile/get-profile'
import { LENS_HANDLE_EXTENSION } from '@config/lens'

export function UserProfileData({ params }) {
  async function fetchUserData(handle) {
    const {
      data: { profile },
    } = await getProfile({ handle: `${handle}${LENS_HANDLE_EXTENSION}` })
    return profile
  }

  const [profile] = createResource(() => params.idUser, fetchUserData)
  return profile
}

export default UserProfileData
