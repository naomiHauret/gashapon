import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Suspense } from 'solid-js'
import { ROUTE_DASHBOARD, ROUTE_DASHBOARD_LIST_GAMES } from '@config/routes'
import { Link } from 'solid-app-router'
import Breadcrumbs from '@components/Breadcrumbs'
import { IconLock } from '@components/Icons'
import useVerifyUser from '@hooks/useVerifyUser'
import button from '@components/Button/button'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)

  createEffect(() => {
    if (stateFetchDefaultProfile?.data?.id && walletVerifiedState?.connected && walletVerifiedState?.verified)
      setUserId(stateFetchDefaultProfile?.data?.id)
  })
  return (
    <>
      <Title>Dashboard - Gashapon</Title>
      <div class="animate-appear border-b-2 pb-6 mb-6 border-solid border-white border-opacity-10">
        <div class="container mx-auto">
          <Breadcrumbs
            class="mb-6"
            links={[
              {
                href: ROUTE_DASHBOARD,
                label: 'Dashboard',
              },
            ]}
          />
          <h1 class="font-bold text-2xl">Dashboard</h1>
        </div>
      </div>

      <main class="mx-auto container">
        <Suspense fallback={<span class="animate-appear">Loading...</span>}>
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
            <div class="animate-appear flex flex-col pt-8 space-y-12 sm:max-w-3/4">
              <div class="flex items-baseline flex-col">
                <Link class="text-xl font-bold" href={ROUTE_DASHBOARD_LIST_GAMES}>
                  Games{' '}
                </Link>
                <p class="mt-2 mb-4 text-neutral-400 text-sm font-medium">
                  Manage the games you created on Gashapon - post udpates, create game pass, upload your game files and
                  track your earnings.
                </p>
                <Link
                  class={button({ intent: 'neutral--revert', scale: 'xs', aspect: 'outline-sm' })}
                  href={ROUTE_DASHBOARD_LIST_GAMES}
                >
                  View games dashboard{' '}
                </Link>
              </div>
              <div class="flex items-baseline flex-col">
                <Link class="text-xl font-bold" href={ROUTE_DASHBOARD_LIST_GAMES}>
                  Posts{' '}
                </Link>
                <p class="mt-2 mb-4 text-neutral-400 text-sm font-medium">Manage the posts related to your profile.</p>
                <Link
                  class={button({ intent: 'neutral--revert', scale: 'xs', aspect: 'outline-sm' })}
                  href={ROUTE_DASHBOARD_LIST_GAMES}
                >
                  View posts dashboard{' '}
                </Link>
              </div>
            </div>
          </Show>
        </Suspense>
      </main>
    </>
  )
}
