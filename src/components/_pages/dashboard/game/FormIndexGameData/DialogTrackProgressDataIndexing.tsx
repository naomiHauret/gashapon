import { Button } from '@components/Button'
import button from '@components/Button/button'
import Callout from '@components/Callout'
import DialogTrackProgress from '@components/DialogTrackProgress'
import { IconCircleSolidCheck, IconErrorCircleOutline, IconSpinner } from '@components/Icons'
import { ROUTE_DASHBOARD_LIST_GAMES } from '@config/routes'
import { Link } from 'solid-app-router'
import { Match, Show, Switch } from 'solid-js'

export const DialogTrackProgressDataIndexing = (props) => {
  return (
    <DialogTrackProgress api={props.api}>
      <ol class="space-y-3">
        <Show when={props.fileGameThumbnail()}>
          <li
            classList={{
              'text-white': props.stateUploadGameThumbnail.isLoading,
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
              'animate-pulse text-white text-opacity-50': props.stateUploadGameThumbnail.isLoading,
              'text-white': !props.stateUploadGameThumbnail.isLoading && props.stateUploadGameBanner.isLoading,
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
            Uploading banner image to Skynet
          </li>
        </Show>
        <Show when={props.filesMedias()}>
          <li
            classList={{
              'animate-pulse text-white text-opacity-50':
                props.stateUploadGameThumbnail.isLoading || props.stateUploadGameBanner.isLoading,
              'text-white':
                !props.stateUploadGameThumbnail.isLoading &&
                !props.stateUploadGameBanner.isLoading &&
                props.stateUploadGameMedias.isLoading,
              'text-positive-300': props.stateUploadGameMedias.isSuccess,
              'text-negative-400': props.stateUploadGameMedias.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match
                when={
                  !props.stateUploadGameThumbnail.isLoading &&
                  !props.stateUploadGameBanner.isLoading &&
                  props.stateUploadGameMedias.isLoading
                }
              >
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
            'text-white text-opacity-50 animate-pulse':
              props.stateUploadGameThumbnail.isLoading ||
              props.stateUploadGameBanner.isLoading ||
              props.stateUploadGameMedias.isLoading,
            'text-white':
              !props.stateUploadGameThumbnail.isLoading &&
              !props.stateUploadGameBanner.isLoading &&
              !props.stateUploadGameMedias.isLoading &&
              props.stateUploadNewGameData.isLoading,
            'text-positive-300': props.stateUploadNewGameData.isSuccess,
            'text-negative-400': props.stateUploadNewGameData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match
              when={
                !props.stateUploadGameThumbnail.isLoading &&
                !props.stateUploadGameBanner.isLoading &&
                !props.stateUploadGameMedias.isLoading &&
                props.stateUploadNewGameData.isLoading
              }
            >
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateUploadNewGameData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateUploadNewGameData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          Uploading your game data to Skynet
        </li>

        <li
          classList={{
            'text-white text-opacity-50 animate-pulse':
              props.stateUploadGameThumbnail.isLoading ||
              props.stateUploadGameBanner.isLoading ||
              props.stateUploadGameMedias.isLoading ||
              props.stateUploadNewGameData.isLoading,
            'text-white':
              !props.stateUploadGameThumbnail.isLoading &&
              !props.stateUploadGameBanner.isLoading &&
              !props.stateUploadGameMedias.isLoading &&
              !props.stateUploadNewGameData.isLoading &&
              props.stateIndexGameData.isLoading,
            'text-positive-300': props.stateIndexGameData.isSuccess,
            'text-negative-400': props.stateIndexGameData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match
              when={
                !props.stateUploadGameThumbnail.isLoading &&
                !props.stateUploadGameBanner.isLoading &&
                !props.stateUploadGameMedias.isLoading &&
                !props.stateUploadNewGameData.isLoading &&
                props.stateIndexGameData.isLoading
              }
            >
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateIndexGameData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateIndexGameData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          <div>
            Indexing your changes on Lens. <br />
            <Show when={!props.stateIndexGameData.isSuccess}>
              <span class="font-bold">Make sure to sign both the message and the transaction in your wallet !</span>
            </Show>
          </div>
        </li>
      </ol>
      <Show when={props.stateIndexGameData.isLoading && props.showWaitMessage() === true}>
        <Callout class="my-6 animate-appear">
          Looks like indexing your game data is taking a bit of time. If the transaction already succeeded in your
          wallet, please reload the page.
        </Callout>
        <Button {...props.api().closeButtonProps}>Close</Button>
      </Show>
      <Show when={props.stateIndexGameData.isError || props.stateIndexGameData.isSuccess}>
        <div class="mt-6 flex flex-col space-y-4 xs:space-y-0 xs:flex-row xs:space-i-4">
          <Link href={ROUTE_DASHBOARD_LIST_GAMES} class={button({ class: 'w-full xs:w-auto' })}>
            Go to created games list
          </Link>
          <Button intent="neutral--revert" class="w-full xs:w-auto" {...props.api().closeButtonProps}>
            Go back
          </Button>
        </div>
      </Show>
    </DialogTrackProgress>
  )
}

export default DialogTrackProgressDataIndexing
