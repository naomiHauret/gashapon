import { createEffect, createSignal, onMount, createResource } from 'solid-js'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { getPublications } from '@graphql/publications/get-publications'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'

async function fetchGames(resource) {
  if (!resource.idUser) return
  const result = await getPublications({
    profileId: resource.idUser,
    publicationTypes: ['POST'],
    metadata: {
      tags: {
        all: ['gameInfo'],
      },
    },
    sources: [LENS_PUBLICATIONS_APP_ID_GAMES_STORE],
  })
  return result
}

export function useDashboardGames() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [resource, setResource] = createSignal({ idUser: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  const [gamesList] = createResource(resource, fetchGames)

  onMount(() => {
    setResource({ idUser: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  })

  createEffect(() => {
    // Refetch user games when profile ID changes
    setResource({ idUser: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  })

  function refreshData() {
    setResource({ idUser: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  }

  return {
    resource,
    refreshData,
    gamesList,
  }
}

export default useDashboardGames
