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
import useDeletePublication from '@hooks/useDeletePublication'
import { Link, useParams, useRouteData } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Suspense, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Title } from 'solid-meta'
import DialogModal from '@components/DialogModal'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { IconLock } from '@components/Icons'

export default function Page() {
  const game = useRouteData()
  const params = useParams()
  const { unindexPublication, stateDeletePublication, apiDialogModalDeletePublication } = useDeletePublication()
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)
  createEffect(() => {
    // Refetch user games when profile ID changes
    if (stateFetchDefaultProfile?.data?.id) setUserId(stateFetchDefaultProfile?.data?.id)
  })

  return (
    <>
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
      <Show when={userId()}>
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
            <Match when={game()?.data && game()?.data?.publication?.profile?.id !== userId()}>
              <div class="animate-appear">
                <h2 class="text-2xl text-white font-bold flex items-center">
                  <IconLock class="mie-1ex" /> Access restricted
                </h2>
                <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
                  You're not allowed to access this page.
                </p>
              </div>
            </Match>
            <Match when={game()?.data && game()?.data?.publication?.profile?.id === userId()}>
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
                          game()?.data?.publication?.metadata?.attributes.filter(
                            (attr) => attr.traitType === 'title',
                          )[0]?.value
                        } overview`,
                      },
                    ]}
                  />
                </div>
                <div class="container animate-appear mx-auto pb-6">
                  <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <div class="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-i-6">
                        <div class="relative w-32 md:w-auto md:h-20 lg:h-32 aspect-game-thumbnail overflow-hidden rounded-md">
                          <span class="w-full h-full absolute top-0 left-0 bg-white bg-opacity-10 animate-pulse block" />
                          <img
                            class="w-full h-full object-cover relative z-10"
                            src={
                              game()?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'thumbnail',
                              )[0]?.value
                            }
                          />
                        </div>

                        <div class="xs:pie-6">
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
                      <Button
                        intent="danger--revert"
                        aspect="outline-sm"
                        scale="xs"
                        {...apiDialogModalDeletePublication().triggerProps}
                      >
                        Unindex
                      </Button>
                    </div>
                  </div>
                </div>
                <div class="container animate-appear mx-auto"></div>
              </div>

              {apiDialogModalDeletePublication().isOpen && (
                <Portal>
                  <DialogModal
                    isDanger={true}
                    hideCloseButton={true}
                    description={`Unindexing a game is similar to deleting it: users won't be able to see it anymore. However, it will still be visible on chain.`}
                    title={`Are you sure you want to unindex ${
                      game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                        ?.value ?? 'this game'
                    } ?`}
                    api={apiDialogModalDeletePublication}
                  >
                    <Show when={!stateDeletePublication.isSuccess}>
                      <div class="animate-appear">
                        <p>
                          Unindexing a game is similar to deleting it: users won't be able to see it anymore. However,
                          it will still be visible on chain.
                        </p>
                        <div class="flex flex-col space-y-4 xs:space-y-0 xs:space-i-4 xs:flex-row mt-8">
                          <Button
                            onClick={async () =>
                              await unindexPublication({
                                publicationId: params.idGame,
                                successMessage: `${
                                  game()?.data?.publication?.metadata?.attributes.filter(
                                    (attr) => attr.traitType === 'title',
                                  )[0]?.value ?? 'This game'
                                } was unindexed successfully !`,
                                errorMessage: `Something went wrong and ${
                                  game()?.data?.publication?.metadata?.attributes.filter(
                                    (attr) => attr.traitType === 'title',
                                  )[0]?.value ?? 'This game'
                                } couldn't be unindexed: `,
                              })
                            }
                            intent="danger"
                            class="w-full xs:w-auto"
                            disabled={stateDeletePublication.isLoading}
                            isLoading={stateDeletePublication.isLoading}
                          >
                            <Show when={stateDeletePublication.isError === false && !stateDeletePublication.isLoading}>
                              Yes, unindex this game
                            </Show>
                            <Show when={stateDeletePublication.isLoading}>Unindexing your game...</Show>
                            <Show when={stateDeletePublication.isError === true}>Try again</Show>
                          </Button>
                          <Button
                            intent="neutral--revert"
                            aspect="outline-sm"
                            class="w-full xs:w-auto"
                            disabled={stateDeletePublication.isLoading}
                            {...apiDialogModalDeletePublication().closeButtonProps}
                          >
                            Go back
                          </Button>
                        </div>
                      </div>
                    </Show>
                    <Show when={stateDeletePublication.isSuccess}>
                      <div class="animate-appear">
                        <p class="font-semibold">
                          {game()?.data?.publication?.metadata?.attributes.filter(
                            (attr) => attr.traitType === 'title',
                          )[0]?.value ?? 'This game'}{' '}
                          was unindexed successfully !
                        </p>

                        <Link href={ROUTE_DASHBOARD_LIST_GAMES} class={button({ class: 'w-full xs:w-auto mt-8' })}>
                          Go back to created games list
                        </Link>
                      </div>
                    </Show>
                  </DialogModal>
                </Portal>
              )}
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
