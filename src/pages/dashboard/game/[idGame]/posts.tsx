import { useParams, useRouteData } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Suspense, Switch } from 'solid-js'
import { Link, Title } from 'solid-meta'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { IconLock } from '@components/Icons'
import DashboardGameLayout from '@layouts/DashboardGame'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE } from '@config/routes'
import button from '@components/Button/button'

export default function Page() {
  const data = useRouteData()
  const params = useParams()
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
                updates dashboard - Gashapon
              </Title>
              <DashboardGameLayout
                ctaGroup={
                  <Link
                    class={button({ scale: 'xs' })}
                    href={ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE.replace(':idGame', params.idGame)}
                  >
                    New update
                  </Link>
                }
                breadcrumbs={[
                  {
                    href: ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE.replace(':idGame', params.idGame),
                    label: 'Updates',
                  },
                ]}
                gameAttributes={data?.game()?.data?.publication?.metadata?.attributes}
              >
                <div class="container animate-appear mx-auto">
                  <h2>Updates</h2>
                </div>
              </DashboardGameLayout>
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
