import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect, createSignal, Show } from 'solid-js'
import { Title } from 'solid-meta'
import { Suspense } from 'solid-js'
import { ROUTE_DASHBOARD, ROUTE_DASHBOARD_LIST_GAMES } from '@config/routes'
import { Link } from 'solid-app-router'
import Breadcrumbs from '@components/Breadcrumbs'
import { IconLock } from '@components/Icons'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const [userId, setUserId] = createSignal(stateFetchDefaultProfile?.data?.id)

  createEffect(() => {
    if (stateFetchDefaultProfile?.data?.id) setUserId(stateFetchDefaultProfile?.data?.id)
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
            <Link href={ROUTE_DASHBOARD_LIST_GAMES}>Games</Link>
          </Show>
        </Suspense>
      </main>
    </>
  )
}
