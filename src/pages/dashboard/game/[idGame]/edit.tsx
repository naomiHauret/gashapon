import Breadcrumbs from '@components/Breadcrumbs'
import { IconLock } from '@components/Icons'
import FormIndexGameData from '@components/_pages/dashboard/game/FormIndexGameData'
import {
  ROUTE_DASHBOARD,
  ROUTE_DASHBOARD_GAME_OVERVIEW,
  ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA,
  ROUTE_DASHBOARD_LIST_GAMES,
} from '@config/routes'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useVerifyUser from '@hooks/useVerifyUser'
import { useParams, useRouteData } from 'solid-app-router'
import { Match, Show, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const data = useRouteData()
  const params = useParams()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()

  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <Show
          when={
            !stateFetchDefaultProfile?.data?.id || !walletVerifiedState?.connected || !walletVerifiedState?.verified
          }
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
              <div class="container mx-auto animate-appear flex flex-col justify-start items-start xs:items-center xs:justify-center">
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
                dashboard - Gashapon
              </Title>
              <div class="border-b-2 border-solid border-white border-opacity-10">
                <div class="container animate-appear mx-auto">
                  <Breadcrumbs
                    class="mb-4"
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
                        href: ROUTE_DASHBOARD_GAME_OVERVIEW.replace(':idGame', params.idGame),
                        label: `${
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
                            ?.value
                        } overview`,
                      },
                      {
                        href: ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA.replace(':idGame', params.idGame),
                        label: 'Edit game',
                      },
                    ]}
                  />
                </div>
              </div>

              <div class="container animate-appear mx-auto pb-6">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div class="pt-6 flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-i-6">
                      <div>
                        <h1 class="font-bold text-2xl">Edit game</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <main class="container animate-appear mx-auto">
                <FormIndexGameData
                  reference={
                    data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'reference')[0]
                      ?.value
                  }
                  initialData={{
                    title: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]?.value,
                    tagline: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'tagline')[0]
                      ?.value,
                    description: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'description')[0]
                      ?.value,
                    productionType: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'productionType')[0]
                      ?.value,
                    developmentTeam: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'developmentTeam',
                      )[0]?.value,
                    status: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'status')[0]?.value,
                    genres: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'genres')[0]
                      ?.value?.split(';'),
                    medias: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                      ?.value?.split(';'),
                    tags: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'tags')[0]
                      ?.value?.split(';'),
                    playerModes: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'playerModes')[0]
                      ?.value?.split(';'),
                    platforms: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'platforms')[0]
                      ?.value?.split(';'),
                    thumbnail: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'thumbnail')[0]
                      ?.value,
                    banner: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'banner')[0]?.value,
                    videoTrailerUrl: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'videoTrailerUrl',
                      )[0]?.value,
                    website: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'website')[0]
                      ?.value,
                    itchUrl: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'itchUrl')[0]
                      ?.value,
                    steamUrl: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'steamUrl')[0]
                      ?.value,
                    appleAppStoreUrl: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'appleAppStoreUrl',
                      )[0]?.value,
                    googlePlayUrl: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'googlePlayUrl')[0]
                      ?.value,
                    minimumSystemRequirementsCpu: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsCpu',
                      )[0]?.value,
                    minimumSystemRequirementsGpu: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsGpu',
                      )[0]?.value,
                    minimumSystemRequirementsOs: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsOs',
                      )[0]?.value,
                    minimumSystemRequirementsRam: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsRam',
                      )[0]?.value,
                    minimumSystemRequirementsStorage: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsStorage',
                      )[0]?.value,
                    minimumSystemRequirementsAdditionalNotes: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'minimumSystemRequirementsAdditionalNotes',
                      )[0]?.value,
                    recommendedSystemRequirementsCpu: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsCpu',
                      )[0]?.value,
                    recommendedSystemRequirementsGpu: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsGpu',
                      )[0]?.value,
                    recommendedSystemRequirementsOs: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsOs',
                      )[0]?.value,
                    recommendedSystemRequirementsRam: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsRam',
                      )[0]?.value,
                    recommendedSystemRequirementsStorage: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsStorage',
                      )[0]?.value,
                    recommendedSystemRequirementsAdditionalNotes: data
                      ?.game()
                      ?.data?.publication?.metadata?.attributes.filter(
                        (attr) => attr.traitType === 'recommendedSystemRequirementsAdditionalNotes',
                      )[0]?.value,
                  }}
                />
              </main>
            </Match>
          </Switch>
        </Show>
      </Suspense>
    </>
  )
}
