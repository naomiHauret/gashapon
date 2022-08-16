import Callout from '@components/Callout'
import { IconLock } from '@components/Icons'
import { LENS_HANDLE_EXTENSION } from '@config/lens'
import { ROUTE_ACCOUNT, ROUTE_SETTINGS, ROUTE_EDIT_PROFILE, ROUTE_USER } from '@config/routes'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'solid-app-router'
import { createEffect, Match, Show, Switch } from 'solid-js'
import styles from './styles.module.css'
export const AccoutLayout = (props) => {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const navigate = useNavigate()
  const location = useLocation()
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
    <div class="flex-grow flex flex-col md:flex-row space-y-6 md:space-y-0 container mx-auto">
      <nav style={{ '--colCount': 3 }} class={`${styles.navbar}`}>
        <Switch>
          <Match when={!stateFetchDefaultProfile?.data?.handle}>
            <span class={styles.navItem}>
              <IconLock class="mie-1ex" />
              Edit profile
            </span>
          </Match>
          <Match when={stateFetchDefaultProfile?.data?.handle}>
            <NavLink
              end={true}
              activeClass={styles['navItem--active']}
              class={styles.navItem}
              href={ROUTE_EDIT_PROFILE}
            >
              Edit profile
            </NavLink>
          </Match>
        </Switch>

        <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_ACCOUNT}>
          Account
        </NavLink>

        <Switch>
          <Match when={!stateFetchDefaultProfile?.data?.handle}>
            <span class={styles.navItem}>
              <IconLock class="mie-1ex" />
              Settings
            </span>
          </Match>
          <Match when={stateFetchDefaultProfile?.data?.handle}>
            <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_SETTINGS}>
              Settings
            </NavLink>
          </Match>
        </Switch>
      </nav>
      <div class="md:pis-8 md:w-full md:grid-cols-1">
        <Show when={stateFetchDefaultProfile.data !== null}>
          <Callout class="animate-appear mb-6 p-5 flex flex-col" intent="dark">
            <span class="text-opacity-70 text-white text-2xs">Currently using Gashapon as:</span> <br />
            <div class="pt-2 flex flex-col items-center xs:flex-row space-y-4 xs:space-y-0 xs:space-i-4">
              <Show when={stateFetchDefaultProfile.data?.picture?.original?.url}>
                <div class="rounded-full overflow-hidden w-14">
                  <img src={stateFetchDefaultProfile.data?.picture?.original?.url} alt="" />
                </div>
              </Show>
              <div>
                <span class="font-mono text-md font-bold">{stateFetchDefaultProfile.data.handle}</span>
                <Link
                  class="mt-3 font-semibold text-2xs link"
                  href={ROUTE_USER.replace(':idUser', stateFetchDefaultProfile.data.handle).replace(
                    LENS_HANDLE_EXTENSION,
                    '',
                  )}
                >
                  {' '}
                  <br />
                  View my profile
                </Link>
              </div>
            </div>
          </Callout>
        </Show>
        <Show when={!stateFetchDefaultProfile.isLoading && stateFetchDefaultProfile.didFetch}>
          <Outlet />
        </Show>
      </div>
    </div>
  )
}

export default AccoutLayout
