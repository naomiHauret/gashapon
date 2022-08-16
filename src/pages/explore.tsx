import { createResource, createSignal, Match, Switch } from 'solid-js'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'
import { explorePublications } from '@graphql/explore/explore-publications'
import { Title } from 'solid-meta'
import Callout from '@components/Callout'
import { ListGames } from '@components/_pages/explore/ListGames'

async function fetchGames(sort) {
  const result = await explorePublications({
    //@ts-ignore
    publicationTypes: ['POST'],
    metadata: {
      tags: {
        oneOf: ['gameInfo'],
      },
    },
    sources: [LENS_PUBLICATIONS_APP_ID_GAMES_STORE],
    sortCriteria: sort,
    limit: 50, // Limit can't be greater than 50
  })
  return result
}

export default function Page() {
  //@ts-ignore
  const [sortOrder, setSortOrder] = createSignal('TOP_COLLECTED')
  const [games] = createResource(() => sortOrder(), fetchGames)

  return (
    <>
      <Title>Explore - Gashapon</Title>
      <main class="mx-auto container">
        <h1 class="font-bold text-2xl mb-8">Explore and discover the latest games</h1>

        <Switch fallback={<>Loading...</>}>
          <Match when={games()?.error?.message}>
            <Callout>{games()?.error?.message}</Callout>
          </Match>
          <Match when={games()?.data?.explorePublications?.items?.length === 0}>No game to show</Match>
          <Match when={games()?.data?.explorePublications?.items?.length > 0}>
            <div class="animate-appear">
              <ListGames
                setSortOrder={setSortOrder}
                sortOrder={sortOrder}
                games={games()?.data?.explorePublications?.items}
              />
            </div>
          </Match>
        </Switch>
      </main>
    </>
  )
}
