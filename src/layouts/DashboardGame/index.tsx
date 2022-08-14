import Breadcrumbs from '@components/Breadcrumbs'
import {
  ROUTE_ACCOUNT,
  ROUTE_SETTINGS,
  ROUTE_EDIT_PROFILE,
  ROUTE_DASHBOARD,
  ROUTE_DASHBOARD_LIST_GAMES,
  ROUTE_DASHBOARD_GAME_OVERVIEW,
  ROUTE_GAME,
  ROUTE_DASHBOARD_GAME_OVERVIEW_SALES_OFFERS,
  ROUTE_DASHBOARD_GAME_OVERVIEW_POST_UPDATE,
  ROUTE_DASHBOARD_GAME_OVERVIEW_FILES,
  ROUTE_DASHBOARD_GAME_OVERVIEW_POSTS,
} from '@config/routes'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'solid-app-router'
import { createEffect } from 'solid-js'
import styles from './../Account/styles.module.css'
export const DashboardGameLayout = (props) => {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  createEffect(() => {
    if (
      !stateFetchDefaultProfile.isLoading &&
      stateFetchDefaultProfile.didFetch &&
      stateFetchDefaultProfile.data === null &&
      [ROUTE_EDIT_PROFILE, ROUTE_SETTINGS].includes(location.pathname)
    ) {
      navigate(ROUTE_ACCOUNT, { replace: true })
    }
  })
  return (
    <>
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
                href: ROUTE_DASHBOARD_GAME_OVERVIEW.replace(':idGame', params.idGame),
                label: `${props.gameAttributes.filter((attr) => attr.traitType === 'title')[0]?.value} overview`,
              },
              ...props?.breadcrumbs
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
                    src={props.gameAttributes.filter((attr) => attr.traitType === 'thumbnail')[0]?.value}
                  />
                </div>

                <div class="xs:pie-6">
                  <h1 class="font-bold text-2xl">
                    {props.gameAttributes.filter((attr) => attr.traitType === 'title')[0]?.value}
                  </h1>
                  <p class="text-neutral-300 mb-2 mt-1">
                    {props.gameAttributes.filter((attr) => attr.traitType === 'tagline')[0]?.value}
                  </p>
                  <Link class="text-xs link" href={ROUTE_GAME.replace(':idGame', params.idGame)}>
                    View detailed page
                  </Link>
                </div>
              </div>
            </div>
            <div class="mt-4 flex space-i-4 md:space-i-0 md:flex-col md:space-y-4">
              {props.ctaGroup}
            </div>
          </div>
        </div>
        <div class="container animate-appear mx-auto"></div>
      </div>
      <div class="py-6 flex-grow flex flex-col md:flex-row space-y-6 md:space-y-0 container mx-auto">
        <nav style={{'--colCount': 4}}class={`${styles.navbar}`}>
          <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_DASHBOARD_GAME_OVERVIEW.replace(':idGame', params.idGame)}>
            Overview
          </NavLink>

          <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_DASHBOARD_GAME_OVERVIEW_SALES_OFFERS.replace(':idGame', params.idGame)}>
            Sales
          </NavLink>

          <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_DASHBOARD_GAME_OVERVIEW_POSTS.replace(':idGame', params.idGame)}>
            Updates
          </NavLink>

          <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_DASHBOARD_GAME_OVERVIEW_FILES.replace(':idGame', params.idGame)}>
            Game files
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  )
}

export default DashboardGameLayout
