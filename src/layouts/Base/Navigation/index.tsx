import { Link } from 'solid-app-router'
import { For } from 'solid-js'
import NavigationMobile from './Mobile'
import navigationItems from './navigationItems'
import styles from './styles.module.css'

export const Navigation = () => {
  return (
    <>
      <nav class="xs:translate-y-1/2 hidden xs:flex font-bold tracking-wide space-i-12 items-end text-xs">
        <For each={navigationItems}>
          {(item) => (
            <Link class={`${styles['navlink']} ${styles['navlink-desktop']}`} href={item.href}>
              {item.label}
            </Link>
          )}
        </For>
      </nav>
      <div class="translate-y-[calc(100%-6px)] xs:hidden">
        <NavigationMobile />
      </div>
    </>
  )
}

export default Navigation
