import { Button } from '@components/Button'
import Callout from '@components/Callout'
import DialogTrackProgress from '@components/DialogTrackProgress'
import { IconCircleSolidCheck, IconErrorCircleOutline, IconSpinner } from '@components/Icons'
import { Match, Show, Switch } from 'solid-js'

export const DialogTrackProgressDataIndexing = (props) => {
  return (
    <DialogTrackProgress api={props.api}>
      <ol class="space-y-3">
        <Show when={props.fileGameThumbnail()}>
          <li
            classList={{
              'text-white text-opacity-50': props.stateUploadGameThumbnail.isLoading,
              'text-positive-300': props.stateUploadGameThumbnail.isSuccess,
              'text-negative-400': props.stateUploadGameThumbnail.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match when={props.stateUploadGameThumbnail.isLoading}>
                <IconSpinner class="text-md mie-1ex animate-spin" />
              </Match>
              <Match when={props.stateUploadGameThumbnail.isSuccess}>
                <IconCircleSolidCheck class="text-md mie-1ex" />
              </Match>
              <Match when={props.stateUploadGameThumbnail.isError}>
                <IconErrorCircleOutline class="text-md mie-1ex" />
              </Match>
            </Switch>
            Uploading thumbnail image to Skynet
          </li>
        </Show>
        <Show when={props.fileGameBanner()}>
          <li
            classList={{
              'text-white text-opacity-50': props.stateUploadGameBanner.isLoading,
              'text-positive-300': props.stateUploadGameBanner.isSuccess,
              'text-negative-400': props.stateUploadGameBanner.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match when={props.stateUploadGameBanner.isLoading}>
                <IconSpinner class="text-md mie-1ex animate-spin" />
              </Match>
              <Match when={props.stateUploadGameBanner.isSuccess}>
                <IconCircleSolidCheck class="text-md mie-1ex" />
              </Match>
              <Match when={props.stateUploadGameBanner.isError}>
                <IconErrorCircleOutline class="text-md mie-1ex" />
              </Match>
            </Switch>
            Uploading baner image to Skynet
          </li>
        </Show>
        <Show when={props.filesMedias()}>
          <li
            classList={{
              'text-white text-opacity-50': props.stateUploadGameMedias.isLoading,
              'text-positive-300': props.stateUploadGameMedias.isSuccess,
              'text-negative-400': props.stateUploadGameMedias.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match when={props.stateUploadGameMedias.isLoading}>
                <IconSpinner class="text-md mie-1ex animate-spin" />
              </Match>
              <Match when={props.stateUploadGameMedias.isSuccess}>
                <IconCircleSolidCheck class="text-md mie-1ex" />
              </Match>
              <Match when={props.stateUploadGameMedias.isError}>
                <IconErrorCircleOutline class="text-md mie-1ex" />
              </Match>
            </Switch>
            Uploading other game medias to Skynet
          </li>
        </Show>
        <li
          classList={{
            'text-white text-opacity-50': props.stateUploadNewGameData.isLoading,
            'text-positive-300': props.stateUploadNewGameData.isSuccess,
            'text-negative-400': props.stateUploadNewGameData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match when={props.stateUploadNewGameData.isLoading}>
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateUploadNewGameData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateUploadNewGameData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          Uploading game data to Skynet & indexing your game data on Lens
        </li>
      </ol>
      <Show when={props.stateUploadNewGameData.isLoading && props.showWaitMessage() === true}>
        <Callout class="my-6 animate-appear">
          Looks like indexing your game data is taking a bit of time. If the transaction already succeeded in your
          wallet, please reload the page.
        </Callout>
        <Button {...props.api().closeButtonProps}>Close</Button>
      </Show>
    </DialogTrackProgress>
  )
}

export default DialogTrackProgressDataIndexing
