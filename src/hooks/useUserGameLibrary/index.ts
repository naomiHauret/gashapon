import { createResource, createEffect, createSignal } from 'solid-js'
import { getPublications } from '@graphql/publications/get-publications'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'
import useVerifyUser from '@hooks/useVerifyUser'
import getCollectedByUser from '@graphql/collect/get-collected'
import { useAccount } from '@hooks/useAccount'

async function fetchLibrary(resource) {
  if (!resource?.profileId) return
  const games = await getCollectedByUser({
    walletAddress: resource?.profileId,
    publicationIds: [],
  })
  return games
}

export function useUserGameLibrary() {
  const { accountData } = useAccount()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [resource, setResource] = createSignal({ profileId: accountData()?.address, timestamp: new Date() })
  const [userLibrary] = createResource(resource, fetchLibrary)

  createEffect(() => {
    // Refetch user games when profile ID changes
    if (stateFetchDefaultProfile?.data?.id && walletVerifiedState?.verified && walletVerifiedState?.connected) {
      setResource({ profileId: accountData()?.address, timestamp: new Date() })
    } else {
      setResource()
    }
  })

  function refreshData() {
    setResource({ profileId: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  }

  return {
    userLibrary,
    refreshData,
  }
}

export default useUserGameLibrary
