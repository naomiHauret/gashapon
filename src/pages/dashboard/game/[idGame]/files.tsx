import { useParams, useRouteData } from 'solid-app-router'
import { createEffect, createSignal, Match, Show, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { IconLock } from '@components/Icons'
import FormUploadGameFiles from '@components/_pages/dashboard/game/FormUploadGameFiles'
import DashboardGameLayout from '@layouts/DashboardGame'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE } from '@config/routes'
import useVerifyUser from '@hooks/useVerifyUser'

export default function Page() {
  const data = useRouteData()
  const params = useParams()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
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
              <div class="container mx-auto animate-appear flex flex-col justify-start items-start xs:items-center xs:justify-center">
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
                files dashboard - Gashapon
              </Title>
              <DashboardGameLayout
                breadcrumbs={[
                  {
                    href: ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE.replace(':idGame', params.idGame),
                    label: 'Files',
                  },
                ]}
                gameAttributes={data?.game()?.data?.publication?.metadata?.attributes}
              >
                <div class="container animate-appear mx-auto">
                  <h2 class="font-bold mb-3 text-lg">Manage game files</h2>
                  <h3 class="font-bold mb-3 text-sm italic text-brand-yellow">
                    How does uploading game files work on Gashapon ?
                  </h3>

                  <p class="text-neutral-300 italic mb-8">
                    First, you need to make sure you created at least one &nbsp;
                    <span class="font-bold">game pass</span> for your game. <br />
                    Game pass are like a key that will grant downloading privileges of your game to the people that
                    bought its game pass.
                  </p>
                  <p class="text-neutral-300 italic mb-8">
                    To ensure that can access your game files location without owning a game pass, Gashapon uses{' '}
                    <span class="font-bold">Lit Protocol</span> to encrypt and decrypt the link to your game files.
                  </p>

                  <FormUploadGameFiles />
                </div>
              </DashboardGameLayout>
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  )
}
