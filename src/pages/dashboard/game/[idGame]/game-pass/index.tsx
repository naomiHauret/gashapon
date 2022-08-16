import { Link, useParams, useRouteData } from 'solid-app-router'
import { Match, Show, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import { IconLock } from '@components/Icons'
import DashboardGameLayout from '@layouts/DashboardGame'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_POST_GAME_PASS, ROUTE_DASHBOARD_GAME_OVERVIEW_GAME_PASS } from '@config/routes'
import button from '@components/Button/button'
import TableGamePass from '@components/_pages/dashboard/game/TableGamePass'
import Callout from '@components/Callout'
import { useDashboardGamePass } from '@hooks/useDashboardGamePass'
import Button from '@components/Button'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useVerifyUser from '@hooks/useVerifyUser'

export default function Page() {
  const data = useRouteData()
  const params = useParams()
  const { refreshData, gamePassList } = useDashboardGamePass()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  return (
    <>
      <Show
        when={!stateFetchDefaultProfile?.data?.id || !walletVerifiedState?.connected || !walletVerifiedState?.verified}
      >
        <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
          <h2 class="text-2xl text-white font-bold flex items-center">
            <IconLock class="mie-1ex" /> Access restricted
          </h2>
          <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
            Please sign-in and verify your account to access this page.
          </p>
        </div>
      </Show>
      <Show
        when={stateFetchDefaultProfile?.data?.id && walletVerifiedState?.connected && walletVerifiedState?.verified}
      >
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
            <Match
              when={
                data?.game()?.data &&
                data?.game()?.data?.publication?.profile?.id !== stateFetchDefaultProfile?.data?.id
              }
            >
              <div class="animate-appear">
                <h2 class="text-2xl text-white font-bold flex items-center">
                  <IconLock class="mie-1ex" /> Access restricted
                </h2>
                <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
                  You're not allowed to access this page.
                </p>
              </div>
            </Match>
            <Match
              when={
                data?.game()?.data &&
                data?.game()?.data?.publication?.profile?.id === stateFetchDefaultProfile?.data?.id
              }
            >
              <Title>
                {
                  data?.game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                    ?.value
                }{' '}
                sales offers dashboard - Gashapon
              </Title>
              <DashboardGameLayout
                ctaGroup={
                  <Link
                    class={button({ scale: 'xs' })}
                    href={ROUTE_DASHBOARD_GAME_OVERVIEW_POST_GAME_PASS.replace(':idGame', params.idGame)}
                  >
                    Create new offer
                  </Link>
                }
                gameAttributes={data?.game()?.data?.publication?.metadata?.attributes}
                breadcrumbs={[
                  {
                    href: ROUTE_DASHBOARD_GAME_OVERVIEW_GAME_PASS.replace(':idGame', params.idGame),
                    label: 'Game pass list',
                  },
                ]}
              >
                <h2 class="font-bold mb-3 text-lg">Game pass overview</h2>
                <h3 class="font-bold mb-3 text-sm italic text-brand-yellow">What's a game pass ?</h3>

                <p class="text-neutral-300 italic mb-8">
                  A game pass is a mix between{' '}
                  <span class="font-bold">a key to access your game files and a price tag</span>. <br /> People who
                  purchase a game pass gain access to the game files associated to it.
                </p>
                <p class="text-neutral-300 italic mb-8">
                  You can of course define the price and currency in your game pass, but also define who can purchase
                  it, the maximum amount of copies to grab, a date until the offer expires, and even a royalty fee if a
                  buyer decides to sell their game pass.
                </p>
                <p class="text-neutral-300 italic mb-8">You can create several game pass for the same game.</p>
                <div class="flex flex-col">
                  <Show when={gamePassList()?.data?.publications || gamePassList()?.error}>
                    <Button
                      aspect="outline-sm"
                      onClick={refreshData}
                      scale="xs"
                      intent="primary--revert"
                      class="mis-auto mb-8 animate-appear"
                    >
                      Refresh
                    </Button>
                  </Show>
                  <Switch fallback={<>Loading...</>}>
                    <Match when={gamePassList()?.error?.message}>
                      <Callout>{gamePassList()?.error?.message}</Callout>
                    </Match>
                    <Match when={gamePassList()?.data?.publications?.items?.length === 0}>
                      <p class="italic text-neutral-400 animate-appear">No game pass created yet.</p>
                    </Match>
                    <Match when={gamePassList()?.data?.publications?.items?.length > 0}>
                      <div class="animate-appear">
                        <TableGamePass gamePassList={gamePassList()?.data?.publications?.items} />
                      </div>
                    </Match>
                  </Switch>
                </div>
              </DashboardGameLayout>
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
