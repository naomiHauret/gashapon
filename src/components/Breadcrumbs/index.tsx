import { Link } from 'solid-app-router'
import { For } from 'solid-js'
import styles from './styles.module.css'

const Breadcrumbs = (props) => {
  return (
    <nav class={`${props.class ?? ''}`}>
      <ul class={`flex text-2xs flex-wrap ${styles.breadcrumbs}`}>
        <For each={props.links}>
          {(link) => (
            <li>
              <Link class="focus:text-neutral-300 text-2xs font-normal text-neutral-400" href={link.href}>
                {link.label}
              </Link>
            </li>
          )}
        </For>
      </ul>
    </nav>
  )
}

export default Breadcrumbs
