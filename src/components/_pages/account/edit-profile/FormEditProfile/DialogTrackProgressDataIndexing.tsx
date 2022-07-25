import { Button } from '@components/Button'
import Callout from '@components/Callout'
import DialogTrackProgress from '@components/DialogTrackProgress'
import { IconCircleSolidCheck, IconErrorCircleOutline, IconSpinner } from '@components/Icons'
import { Match, Show, Switch } from 'solid-js'

export const DialogTrackProgressDataIndexing = (props) => {
  return (
    <DialogTrackProgress api={props.api}>
      <ol class="space-y-3">
        <Show when={props.fileProfilePicture()}>
          <li
            classList={{
              'text-white': props.stateUploadProfilePicture.isLoading,
              'text-positive-300': props.stateUploadProfilePicture.isSuccess,
              'text-negative-400': props.stateUploadProfilePicture.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match when={props.stateUploadProfilePicture.isLoading}>
                <IconSpinner class="text-md mie-1ex animate-spin" />
              </Match>
              <Match when={props.stateUploadProfilePicture.isSuccess}>
                <IconCircleSolidCheck class="text-md mie-1ex" />
              </Match>
              <Match when={props.stateUploadProfilePicture.isError}>
                <IconErrorCircleOutline class="text-md mie-1ex" />
              </Match>
            </Switch>
            Uploading profile picture to Skynet
          </li>
        </Show>
        <Show when={props.fileProfileBanner()}>
          <li
            classList={{
              'animate-pulse text-white text-opacity-50': props.stateUploadProfilePicture.isLoading,
              'text-white': !props.stateUploadProfilePicture.isLoading && props.stateUploadProfileBanner.isLoading,
              'text-positive-300': props.stateUploadProfileBanner.isSuccess,
              'text-negative-400': props.stateUploadProfileBanner.isError,
            }}
            class="flex items-center"
          >
            <Switch>
              <Match when={props.stateUploadProfileBanner.isLoading}>
                <IconSpinner class="text-md mie-1ex animate-spin" />
              </Match>
              <Match when={props.stateUploadProfileBanner.isSuccess}>
                <IconCircleSolidCheck class="text-md mie-1ex" />
              </Match>
              <Match when={props.stateUploadProfileBanner.isError}>
                <IconErrorCircleOutline class="text-md mie-1ex" />
              </Match>
            </Switch>
            Uploading banner image to Skynet
          </li>
        </Show>
        <li
          classList={{
            'text-white text-opacity-50 animate-pulse':
              props.stateUploadProfilePicture.isLoading || props.stateUploadProfileBanner.isLoading,
            'text-white':
              !props.stateUploadProfilePicture.isLoading &&
              !props.stateUploadProfileBanner.isLoading &&
              props.stateUploadProfileData.isLoading,
            'text-positive-300': props.stateUploadProfileData.isSuccess,
            'text-negative-400': props.stateUploadProfileData.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match
              when={
                !props.stateUploadProfilePicture.isLoading &&
                !props.stateUploadProfileBanner.isLoading &&
                props.stateUploadProfileData.isLoading
              }
            >
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateUploadProfileData.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateUploadProfileData.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          Uploading profile data to Skynet
        </li>
        <li
          classList={{
            'text-white text-opacity-50 animate-pulse':
              props.stateUploadProfilePicture.isLoading ||
              props.stateUploadProfileBanner.isLoading ||
              props.stateUploadProfileData.isLoading,
            'text-white':
              !props.stateUploadProfilePicture.isLoading &&
              !props.stateUploadProfileBanner.isLoading &&
              !props.stateUploadProfileData.isLoading &&
              props.stateEditProfile.isLoading,
            'text-positive-300': props.stateEditProfile.isSuccess,
            'text-negative-400': props.stateEditProfile.isError,
          }}
          class="flex items-center"
        >
          <Switch>
            <Match
              when={
                !props.stateUploadProfilePicture.isLoading &&
                !props.stateUploadProfileBanner.isLoading &&
                !props.stateUploadProfileData.isLoading &&
                props.stateEditProfile.isLoading
              }
            >
              <IconSpinner class="text-md mie-1ex animate-spin" />
            </Match>
            <Match when={props.stateEditProfile.isSuccess}>
              <IconCircleSolidCheck class="text-md mie-1ex" />
            </Match>
            <Match when={props.stateEditProfile.isError}>
              <IconErrorCircleOutline class="text-md mie-1ex" />
            </Match>
          </Switch>
          <div>
            Indexing your changes on Lens. <br />
            <span class="font-bold">Make sure to sign both the message and the transaction in your wallet !</span>
          </div>
        </li>
      </ol>
      <Show when={props.stateEditProfile.isLoading && props.showWaitMessage() === true}>
        <Callout class="my-6 animate-appear">
          Looks like indexing your profile data is taking a bit of time. If the transaction already succeeded in your
          wallet, please reload the page.
        </Callout>
        <Button {...props.api().closeButtonProps}>Close</Button>
      </Show>
      <Show when={props.stateEditProfile.isError || props.stateEditProfile.isSuccess}>
        <Button class="mt-6" {...props.api().closeButtonProps}>
          Go back
        </Button>
      </Show>
    </DialogTrackProgress>
  )
}

export default DialogTrackProgressDataIndexing
