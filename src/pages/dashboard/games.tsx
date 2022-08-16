import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { Suspense } from 'solid-js'
import Callout from '@components/Callout'
import { ROUTE_CREATE_GAME, ROUTE_DASHBOARD, ROUTE_DASHBOARD_LIST_GAMES } from '@config/routes'
import TableGamesCreated from '@components/_pages/dashboard/games/TableGamesCreated'
import Breadcrumbs from '@components/Breadcrumbs'
import { IconLock } from '@components/Icons'
import button from '@components/Button/button'
import { Link } from 'solid-app-router'
import useDashboardGames from '@hooks/useDashboardGames'
import Button from '@components/Button'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const { refreshData, gamesList } = useDashboardGames()

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
          <div class="mt-4 space-y-4 flex flex-col md:flex-row md:justify-between md:items-center md:space-y-0">
            <h1 class="font-bold text-2xl">Created games</h1>
            <Show when={stateFetchDefaultProfile?.data?.id}>
              <div>
                <Link href={ROUTE_CREATE_GAME} class={button({ scale: 'xs' })}>
                  Create new game
                </Link>
              </div>
            </Show>
          </div>
        </div>
      </div>

      <main class="mx-auto container">
        <Suspense fallback={<span class="animate-appear">Loading your created games...</span>}>
          <Show when={!stateFetchDefaultProfile?.data?.id}>
            <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
              <h2 class="text-2xl text-white font-bold flex items-center">
                <IconLock class="mie-1ex" /> Access restricted
              </h2>
              <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
                Please sign-in and verify your account to access this page.
              </p>
            </div>
          </Show>
          <Show when={gamesList()?.error}>
            <div class="animate-appear mb-6">
              <Callout>An error occured: {gamesList().error.message}</Callout>
            </div>
          </Show>
          <Show when={gamesList()?.data?.publications || gamesList()?.error}>
            <Button aspect="outline-sm" onClick={refreshData} scale="xs" intent="primary--revert" class="mis-auto mb-8">
              Refresh
            </Button>
          </Show>
          <Show when={gamesList()?.data?.publications}>
            <div class="animate-appear">
              <Switch>
                <Match when={gamesList()?.data?.publications?.items.length === 0}>
                  <div class="mt-8 flex flex-col justify-center items-center">
                    <p class="text-neutral-500 font-bold text-xl">It looks like you didn't create any game yet.</p>
                    <Link
                      class={button({
                        class: 'mt-6',
                      })}
                      href={ROUTE_CREATE_GAME}
                    >
                      Create my first game
                    </Link>
                  </div>
                </Match>
                <Match when={gamesList()?.data?.publications?.items.length > 0}>
                  <TableGamesCreated
                    games={gamesList()?.data?.publications?.items.map((game) => ({
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
