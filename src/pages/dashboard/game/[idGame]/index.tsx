import Breadcrumbs from '@components/Breadcrumbs'
import Button from '@components/Button'
import button from '@components/Button/button'
import {
  ROUTE_DASHBOARD,
  ROUTE_DASHBOARD_GAME_OVERVIEW,
  ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA,
  ROUTE_DASHBOARD_LIST_GAMES,
  ROUTE_GAME,
} from '@config/routes'
import { Link, useParams, useRouteData } from 'solid-app-router'
import { Match, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const game = useRouteData()
  const params = useParams()
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <Switch>
          {/* @ts-ignore */}
          <Match when={game()?.error && !game()?.data}>
            <Title>Game not found - Dashboard - Gashapon</Title>
            <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
              <h1 class="mb-4 font-bold text-2xl">This game is a MissingNo !</h1>
              <p class="text-ex font-semibold text-neutral-400">
                It seems like this game doesn't exist or was deleted.
              </p>
            </div>
          </Match>
          <Match when={game()?.data}>
            <Title>
              {game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]?.value}{' '}
              dashboard - Gashapon
            </Title>
            <div class="border-b-2 border-solid border-white border-opacity-10">
              <div class="container animate-appear mx-auto">
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
                    {
                      href: ROUTE_DASHBOARD_GAME_OVERVIEW,
                      label: `${
                        game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                          ?.value
                      } overview`,
                    },
                  ]}
                />
              </div>
              <div class="container animate-appear mx-auto pb-6">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div class="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-i-6">
                      <img
                        class="w-full 2xs:w-48 xs:w-32 aspect-game-thumbnail rounded-md bg-neutral-500"
                        src={
                          game()?.data?.publication?.metadata?.attributes.filter(
                            (attr) => attr.traitType === 'thumbnail',
                          )[0]?.value
                        }
                      />
                      <div>
                        <h1 class="font-bold text-2xl">
                          {
                            game()?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'title',
                            )[0]?.value
                          }
                        </h1>
                        <p class="text-neutral-300 mb-2 mt-1">
                          {
                            game()?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'tagline',
                            )[0]?.value
                          }
                        </p>
                        <Link class="text-xs link" href={ROUTE_GAME.replace(':idGame', params.idGame)}>
                          View detailed page
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 flex space-i-4 md:space-i-0 md:flex-col md:space-y-4">
                    <Link
                      class={button({ scale: 'xs' })}
                      href={ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA.replace(':idGame', params.idGame)}
                    >
                      Edit
                    </Link>
                    <Button intent="danger--revert" aspect="outline-sm" scale="xs">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              <div class="container animate-appear mx-auto"></div>
            </div>
          </Match>
        </Switch>
      </Suspense>
    </>
  )
}
