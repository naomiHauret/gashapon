import { Button } from '@components/Button'
import Callout from '@components/Callout'
import DialogTrackProgress from '@components/DialogTrackProgress'
import { IconCircleSolidCheck, IconErrorCircleOutline, IconSpinner } from '@components/Icons'
import { createEffect, Match, Show, Switch } from 'solid-js'

export const DialogTrackProgressDataIndexing = (props) => {
  return (
    <DialogTrackProgress api={props.api}>
      <ol class="space-y-3">
        <li
          classList={{
            'text-white': props.stateIndexPurchaseGamePass.isLoading,
            'text-positive-300': props.stateIndexPurchaseGamePass.isSuccess,
            'text-negative-400': props.stateIndexPurchaseGamePass.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match when={props.stateIndexPurchaseGamePass.isLoading === true}>
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateIndexPurchaseGamePass.isSuccess === true}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateIndexPurchaseGamePass.isError === true}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          <div>
            Indexing your purchase on Lens. <br />
            <Show when={!props.stateIndexPurchaseGamePass.isSuccess}>
              <span class="font-bold">Make sure to sign both the message and the transaction in your wallet !</span>
            </Show>
          </div>
        </li>
      </ol>
      <Show when={props.stateIndexPurchaseGamePass.isLoading && props.showWaitMessage() === true}>
        <Callout class="my-6 animate-appear">
          Looks like indexing your purchase is taking a bit of time. If the transaction already succeeded in your
          wallet, please reload the page.
        </Callout>
        <Button {...props.api().closeButtonProps}>Close</Button>
      </Show>
      <Show when={props.stateIndexPurchaseGamePass.isError || props.stateIndexPurchaseGamePass.isSuccess}>
        <div class="mt-6 flex flex-col space-y-4 xs:space-y-0 xs:flex-row xs:space-i-4">
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
