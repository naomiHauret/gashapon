import { LENS_PUBLICATIONS_APP_ID } from '@config/lens'
import { getPublications } from '@graphql/publication/get-publications'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect, createResource, createSignal, For, Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { Suspense } from 'solid-js'
import Callout from '@components/Callout'
import { ROUTE_DASHBOARD, ROUTE_DASHBOARD_LIST_GAMES, ROUTE_GAME } from '@config/routes'
import { Link } from 'solid-app-router'
import TableGamesCreated from '@components/_pages/dashboard/games/TableGamesCreated'
import Breadcrumbs from '@components/Breadcrumbs'
import { IconLock } from '@components/Icons'

async function fetchGames(profileId) {
  if (!profileId) return
  const result = await getPublications({
    profileId,
    publicationTypes: ['POST'],
    sources: [LENS_PUBLICATIONS_APP_ID],
  })
  return result
}

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)
  const [games] = createResource(userId, fetchGames)

  createEffect(() => {
    // Refetch user games when profile ID changes
    if (stateFetchDefaultProfile?.data?.id) setUserId(stateFetchDefaultProfile?.data?.id)
  })

  createEffect(() => {
    console.log(games())
  })
  return (
    <>
      <Title>Created games dashboard - Gashapon</Title>
      <div class="animate-appear border-b-2 pb-6 mb-6 border-solid border-white border-opacity-10">
        <div class="container mx-auto">
          <Breadcrumbs
            class="mb-6"
            links={[
              {
                href: ROUTE_DASHBOARD,
                label: 'Dashboard',
              },
              {
                href: ROUTE_DASHBOARD_LIST_GAMES,
                label: 'Created games',
              },
            ]}
          />
          <h1 class="font-bold text-2xl">Created games</h1>
        </div>
      </div>

      <main class="mx-auto container">
        <Suspense fallback={<span class="animate-appear">Loading your created games...</span>}>
          <Show when={!userId()}>
            <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
              <h2 class="text-2xl text-white font-bold flex items-center">
                <IconLock class="mie-1ex" /> Access restricted
              </h2>
              <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
                Please sign-in and verify your account to access this page.
              </p>
            </div>
          </Show>
          <Show when={games()?.error}>
            <div class="animate-appear mb-6">
              <Callout>An error occured: {games().error.message}</Callout>
            </div>
          </Show>
          <Show when={games()?.data?.publications}>
            <div class="animate-appear">
              <Switch>
                <Match when={games()?.data?.publications?.items.length === 0}>No game created</Match>
                <Match when={games()?.data?.publications?.items.length > 0}>
                  <TableGamesCreated
                    games={games()?.data?.publications?.items.map((game) => ({
                      id: game.id,
                      lastUpdated:
                        game.metadata.attributes.filter((attr) => attr.traitType === 'lastUpdated')[0]?.value ?? '',
                      title: game.metadata.attributes.filter((attr) => attr.traitType === 'title')[0]?.value ?? '',
                      thumbnail:
                        game.metadata.attributes.filter((attr) => attr.traitType === 'thumbnail')[0]?.value ?? '',
                      status: game.metadata.attributes.filter((attr) => attr.traitType === 'status')[0]?.value ?? '',
                      genres: game.metadata.attributes.filter((attr) => attr.traitType === 'genres')[0]?.value ?? '',
                      platforms:
                        game.metadata.attributes.filter((attr) => attr.traitType === 'platforms')[0]?.value ?? '',
                    }))}
                  />
                </Match>
              </Switch>
            </div>
          </Show>
        </Suspense>
      </main>
    </>
  )
}
