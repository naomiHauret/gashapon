import { useParams } from 'solid-app-router'
import { createEffect, createSignal, onMount, createResource } from 'solid-js'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { getPublications } from '@graphql/publications/get-publications'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'

async function fetchGamePassList(resource) {
  if (!resource.idUser) return
  const params = useParams()
  const result = await getPublications({
    profileId: resource.idUser,
    publicationTypes: ['POST'],
    metadata: {
      tags: {
        all: ['gamePass', 'gashapon', params.idGame.replace('-', '')],
      },
    },
    sources: [LENS_PUBLICATIONS_APP_ID_GAMES_STORE],
  })
  return result
}

export function useDashboardGamePass() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [resource, setResource] = createSignal({ idUser: stateFetchDefaultProfile?.data?.id, timestamp: new Date() })
  const [gamePassList] = createResource(resource, fetchGamePassList)

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
    gamePassList,
  }
}

export default useDashboardGamePass
