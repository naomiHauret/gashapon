import { Link, useParams, useRouteData } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { IconLock } from '@components/Icons'
import DashboardGameLayout from '@layouts/DashboardGame'
import useDeletePublication from '@hooks/useDeletePublication'
import Button from '@components/Button'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA, ROUTE_DASHBOARD_LIST_GAMES } from '@config/routes'
import button from '@components/Button/button'
import { Portal } from 'solid-js/web'
import DialogModal from '@components/DialogModal'

export default function Page() {
  const data = useRouteData()
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)
  const params = useParams()
  const { unindexPublication, stateDeletePublication, apiDialogModalDeletePublication } = useDeletePublication()

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
            <Match when={data?.game()?.error && !data?.game()?.data}>
              <Title>Game not found - Dashboard - Gashapon</Title>
              <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
                <h1 class="mb-4 font-bold text-2xl">This game is a MissingNo !</h1>
                <p class="text-ex font-semibold text-neutral-400">
                  It seems like this game doesn't exist or was deleted.
                </p>
              </div>
            </Match>
            <Match when={data?.game()?.data && data?.game()?.data?.publication?.profile?.id !== userId()}>
              <div class="animate-appear">
                <h2 class="text-2xl text-white font-bold flex items-center">
                  <IconLock class="mie-1ex" /> Access restricted
                </h2>
                <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
                  You're not allowed to access this page.
                </p>
              </div>
            </Match>
            <Match when={data?.game()?.data && data?.game()?.data?.publication?.profile?.id === userId()}>
              <Title>
                {
                  data?.game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                    ?.value
                }{' '}
                dashboard - Gashapon
              </Title>
              <DashboardGameLayout
                ctaGroup={
                  <>
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
                  </>
                }
                breadcrumbs={[]}
                gameAttributes={data?.game()?.data?.publication?.metadata?.attributes}
              >
                <div class="container animate-appear mx-auto">
                  <h2>Overview</h2>
                </div>

                {apiDialogModalDeletePublication().isOpen && (
                  <Portal>
                    <DialogModal
                      isDanger={true}
                      hideCloseButton={true}
                      description={`Unindexing a game is similar to deleting it: users won't be able to see it anymore. However, it will still be visible on chain.`}
                      title={`Are you sure you want to unindex ${
                        data
                          ?.game()
                          ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
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
                                    data
                                      ?.game()
                                      ?.data?.publication?.metadata?.attributes.filter(
                                        (attr) => attr.traitType === 'title',
                                      )[0]?.value ?? 'This game'
                                  } was unindexed successfully !`,
                                  errorMessage: `Something went wrong and ${
                                    data
                                      ?.game()
                                      ?.data?.publication?.metadata?.attributes.filter(
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
                              <Show
                                when={stateDeletePublication.isError === false && !stateDeletePublication.isLoading}
                              >
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
                            {data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                              ?.value ?? 'This game'}{' '}
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
              </DashboardGameLayout>
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
