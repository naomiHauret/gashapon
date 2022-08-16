import Breadcrumbs from '@components/Breadcrumbs'
import FormIndexGameData from '@components/_pages/dashboard/game/FormIndexGameData'
import {
  ROUTE_DASHBOARD,
  ROUTE_DASHBOARD_GAME_OVERVIEW,
  ROUTE_DASHBOARD_GAME_OVERVIEW_EDIT_DATA,
  ROUTE_DASHBOARD_LIST_GAMES,
} from '@config/routes'
import { useParams, useRouteData } from 'solid-app-router'
import { Match, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const data = useRouteData()
  const params = useParams()

  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <Switch>
          {/* @ts-ignore */}
          <Match when={data?.game()?.error && !dat?.game()?.data}>
            <Title>Game not found - Dashboard - Gashapon</Title>
            <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
              <h1 class="mb-4 font-bold text-2xl">This game is a MissingNo !</h1>
              <p class="text-ex font-semibold text-neutral-400">
                It seems like this game doesn't exist or was deleted.
              </p>
            </div>
          </Match>
          <Match when={dat?.game()?.data}>
            <Title>
              {
                dat?.game()?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]
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
                        dat
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
                  dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'reference')[0]?.value
                }
                initialData={{
                  title: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]?.value,
                  tagline: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'tagline')[0]?.value,
                  description: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'description')[0]
                    ?.value,
                  productionType: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'productionType')[0]
                    ?.value,
                  developmentTeam: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'developmentTeam')[0]
                    ?.value,
                  status: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'status')[0]?.value,
                  genres: game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'genres')[0]
                    ?.value?.split(';'),
                  medias: game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                    ?.value?.split(';'),
                  tags: game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'tags')[0]
                    ?.value?.split(';'),
                  playerModes: game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'playerModes')[0]
                    ?.value?.split(';'),
                  platforms: game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'platforms')[0]
                    ?.value?.split(';'),
                  thumbnail: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'thumbnail')[0]
                    ?.value,
                  banner: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'banner')[0]?.value,
                  videoTrailerUrl: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'videoTrailerUrl')[0]
                    ?.value,
                  website: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'website')[0]?.value,
                  itchUrl: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'itchUrl')[0]?.value,
                  steamUrl: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'steamUrl')[0]?.value,
                  appleAppStoreUrl: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'appleAppStoreUrl')[0]
                    ?.value,
                  googlePlayUrl: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'googlePlayUrl')[0]
                    ?.value,
                  minimumSystemRequirementsCpu: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsCpu',
                    )[0]?.value,
                  minimumSystemRequirementsGpu: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsGpu',
                    )[0]?.value,
                  minimumSystemRequirementsOs: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsOs',
                    )[0]?.value,
                  minimumSystemRequirementsRam: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsRam',
                    )[0]?.value,
                  minimumSystemRequirementsStorage: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsStorage',
                    )[0]?.value,
                  minimumSystemRequirementsAdditionalNotes: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'minimumSystemRequirementsAdditionalNotes',
                    )[0]?.value,
                  recommendedSystemRequirementsCpu: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsCpu',
                    )[0]?.value,
                  recommendedSystemRequirementsGpu: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsGpu',
                    )[0]?.value,
                  recommendedSystemRequirementsOs: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsOs',
                    )[0]?.value,
                  recommendedSystemRequirementsRam: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsRam',
                    )[0]?.value,
                  recommendedSystemRequirementsStorage: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsStorage',
                    )[0]?.value,
                  recommendedSystemRequirementsAdditionalNotes: dat
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter(
                      (attr) => attr.traitType === 'recommendedSystemRequirementsAdditionalNotes',
                    )[0]?.value,
                }}
              />
            </main>
          </Match>
        </Switch>
      </Suspense>
    </>
  )
}
