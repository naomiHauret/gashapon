import { IconLock } from '@components/Icons'
import FormNewGamePass from '@components/_pages/dashboard/game/FormNewGamePass'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_POST_GAME_PASS, ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE } from '@config/routes'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useVerifyUser from '@hooks/useVerifyUser'
import DashboardGameLayout from '@layouts/DashboardGame'
import { useParams, useRouteData } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const data = useRouteData()
  const params = useParams()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)
  createEffect(() => {
    // Refetch user games when profile ID changes
    if (stateFetchDefaultProfile?.data?.id && walletVerifiedState?.connected && walletVerifiedState?.verified)
      setUserId(stateFetchDefaultProfile?.data?.id)
  })

  return (
    <>
      <Show when={!userId() || !walletVerifiedState?.connected || !walletVerifiedState?.verified}>
        <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
          <h2 class="text-2xl text-white font-bold flex items-center">
            <IconLock class="mie-1ex" /> Access restricted
          </h2>
          <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
            Please sign-in and verify your account to access this page.
          </p>
        </div>
      </Show>
      <Show when={userId() && walletVerifiedState?.connected && walletVerifiedState?.verified}>
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
                Create new game pass -{' '}
                {
                  data?.game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                    ?.value
                }{' '}
                - Gashapon
              </Title>
              <DashboardGameLayout
                breadcrumbs={[
                  {
                    href: ROUTE_DASHBOARD_GAME_OVERVIEW_POST_GAME_PASS.replace(':idGame', params.idGame),
                    label: 'New game pass offer',
                  },
                ]}
                gameAttributes={data?.game()?.data?.publication?.metadata?.attributes}
              >
                <div class="animate-appear">
                  <h2 class="font-bold mb-3 text-lg">Create a new game pass</h2>
                  <p class="font-semibold text-md mb-3">
                    Let's create a game pass for{' '}
                    <span class="text-brand-yellow">
                      {
                        data
                          ?.game()
                          ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                          ?.value
                      }
                    </span>
                    .
                  </p>
                  <p class="text-neutral-300 italic mb-8">You'll upload your game files later.</p>
                  <FormNewGamePass
                    game={{
                      id: params.idGame,
                      title: data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                        ?.value,
                      banner: data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'banner')[0]
                        ?.value,
                    }}
                  />
                </div>
              </DashboardGameLayout>
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
