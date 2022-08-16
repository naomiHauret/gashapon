import { Button } from '@components/Button'
import button from '@components/Button/button'
import Callout from '@components/Callout'
import DialogTrackProgress from '@components/DialogTrackProgress'
import { IconCircleSolidCheck, IconErrorCircleOutline, IconSpinner } from '@components/Icons'
import { ROUTE_DASHBOARD_GAME_OVERVIEW_GAME_PASS } from '@config/routes'
import { Link } from 'solid-app-router'
import { Match, Show, Switch } from 'solid-js'

export const DialogTrackProgressDataIndexing = (props) => {
  return (
    <DialogTrackProgress api={props.api}>
      <ol class="space-y-3">
        <li
          classList={{
            'text-white': props.stateUploadNewGamePassData.isLoading,
            'text-positive-300': props.stateUploadNewGamePassData.isSuccess,
            'text-negative-400': props.stateUploadNewGamePassData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match when={props.stateUploadNewGamePassData.isLoading}>
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateUploadNewGamePassData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateUploadNewGamePassData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          Uploading your game pass data to Skynet
        </li>

        <li
          classList={{
            'text-white text-opacity-50 animate-pulse': props.stateUploadNewGamePassData.isLoading,
            'text-white': !props.stateUploadNewGamePassData.isLoading && props.stateIndexGamePassData.isLoading,
            'text-positive-300': props.stateIndexGamePassData.isSuccess,
            'text-negative-400': props.stateIndexGamePassData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match when={!props.stateUploadNewGamePassData.isLoading && props.stateIndexGamePassData.isLoading}>
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateIndexGamePassData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateIndexGamePassData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          <div>
            Indexing your changes on Lens. <br />
            <Show when={!props.stateIndexGamePassData.isSuccess}>
              <span class="font-bold">Make sure to sign both the message and the transaction in your wallet !</span>
            </Show>
          </div>
        </li>
      </ol>
      <Show when={props.stateIndexGamePassData.isLoading && props.showWaitMessage() === true}>
        <Callout class="my-6 animate-appear">
          Looks like indexing your game pass is taking a bit of time. If the transaction already succeeded in your
          wallet, please reload the page.
        </Callout>
        <Button {...props.api().closeButtonProps}>Close</Button>
      </Show>
      <Show when={props.stateIndexGamePassData.isError || props.stateIndexGamePassData.isSuccess}>
        <div class="mt-6 flex flex-col space-y-4 xs:space-y-0 xs:flex-row xs:space-i-4">
          <Link
            href={ROUTE_DASHBOARD_GAME_OVERVIEW_GAME_PASS.replace(':idGame', props.game.id)}
            class={button({ class: 'w-full xs:w-auto' })}
          >
            Go to game pass list
          </Link>
          <Button
            aspect="outline-sm"
            intent="neutral--revert"
            class="w-full xs:w-auto"
            {...props.api().closeButtonProps}
          >
            Go back
          </Button>
        </div>
      </Show>
    </DialogTrackProgress>
  )
}

export default DialogTrackProgressDataIndexing
