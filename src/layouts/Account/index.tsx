import { ROUTE_ACCOUNT, ROUTE_SETTINGS, ROUTE_EDIT_PROFILE } from '@config/routes'
import { NavLink, Outlet } from 'solid-app-router'
import styles from './styles.module.css'
export const AccoutLayout = (props) => {
  return (
    <div class="flex-grow flex flex-col md:flex-row space-y-6 md:space-y-0 container mx-auto">
      <nav class={`${styles.navbar}`}>
        <NavLink activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_EDIT_PROFILE}>
          Public profile
        </NavLink>
        <NavLink end={true} activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_ACCOUNT}>
          Account
        </NavLink>
        <NavLink activeClass={styles['navItem--active']} class={styles.navItem} href={ROUTE_SETTINGS}>
          Settings
        </NavLink>
      </nav>
      <div class="md:pis-20 md:w-full md:grid-cols-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AccoutLayout
