import { createMemo, createUniqueId, For } from 'solid-js'
import { Link } from 'solid-app-router'
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine, useSetup } from '@zag-js/solid'
import popoverStyles from '@components/PopoverConnectWallet/styles.module.css'
import navigationItems from './navigationItems'
import type { PropTypes } from '@zag-js/solid'
import { IconMenu } from '@components/Icons'
import styles from './styles.module.css'

export const NavigationMobile = () => {
  const id = createUniqueId()
  const [state, send] = useMachine(popover.machine)
  const ref = useSetup({ send, id })
  const api = createMemo(() => popover.connect<PropTypes>(state, send, normalizeProps))

  return (
    <div class="relative" ref={ref}>
      <button class={`${styles.navlink} ${styles['navlink-desktop']}`} {...api().triggerProps}>
        <IconMenu />
        <span class="sr-only">Menu</span>
      </button>
      <div {...api().positionerProps}>
        <nav
          class={`bg-black mt-4 border-solid overflow-hidden rounded-lg w-[calc(100vw-20px)] xs:w-auto xs:min-w-60 ${popoverStyles.popoverContentBody}`}
          {...api().contentProps}
        >
          <div class="sr-only" {...api().titleProps}>
            Navigation menu
          </div>
          <ul>
            <For each={navigationItems}>
              {(item) => (
                <li>
                  <Link class={popoverStyles.popoverSectionLink} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default NavigationMobile
