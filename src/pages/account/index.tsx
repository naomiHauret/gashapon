import Callout from '@components/Callout'
import { IconSpinner } from '@components/Icons'
import FormCreateProfile from '@components/_pages/my-profile/FormCreateProfile'
import FormSelectDefaultProfile from '@components/_pages/my-profile/FormSelectDefaultProfile'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile, stateFetchOwnedProfiles } = useDefaultProfile()

  return (
    <>
      <Title>My profile - Gashapon</Title>
      <main class="mx-auto container">
        <Show
          when={
            (!stateFetchDefaultProfile.didFetch && stateFetchDefaultProfile.isLoading) ||
            (!stateFetchOwnedProfiles.didFetch && stateFetchOwnedProfiles.isLoading)
          }
        >
          <IconSpinner class="animate-spin" />
        </Show>
        <Show when={stateFetchDefaultProfile.didFetch === true && stateFetchOwnedProfiles.didFetch === true}>
          <Show when={stateFetchDefaultProfile.data === null}>
            <h1 class="animate-appear font-bold mb-6 text-3xl w-full md:max-w-3/4">
              Looks like you didn't set your account yet.
            </h1>
          </Show>
          <Switch>
            <Match when={stateFetchDefaultProfile.data === null && stateFetchOwnedProfiles.data === null}>
              <div class="animate-appear w-full md:max-w-3/4">
                <p class="font-semibold text-md mb-3">
                  Before creating your account, you'll need to claim your{' '}
                  <a href="https://lens.xyz" target="_blank" rel="nofollow noreferrer">
                    Lens
                  </a>{' '}
                  profile handle first.
                </p>
                <p class="text-neutral-500 italic">
                  You will be able to re-use the data attached to your account handle on other apps that use Lens
                  protocol. Pretty cool huh?
                </p>
                <div class="w-full max-w-screen-xs mt-6">
                  <FormCreateProfile />
                </div>
              </div>
            </Match>
            <Match
              when={
                stateFetchOwnedProfiles.data !== null &&
                stateFetchDefaultProfile.data === null &&
                stateFetchDefaultProfile.isError === false
              }
            >
              <div class="animate-appear w-full">
                <p class="font-semibold text-md mb-3">Pick your default account.</p>
                <p class="text-neutral-500 italic">Select the default account you want to use on Gashapon.</p>
                <p class="text-neutral-500 italic">
                  Don't worry, you can change your default account whenever you want.
                </p>
                <div class="w-full max-w-screen-xs mt-6">
                  <FormSelectDefaultProfile />
                </div>
              </div>
            </Match>
            <Match when={stateFetchDefaultProfile.data !== null && stateFetchDefaultProfile.isError === false}>
              <div class="animate-appear w-full">
                <Callout intent="neutral">
                  <span class="text-opacity-40 text-white text-2xs">Currently using Gashapon as:</span> <br />
                  <span class="font-mono text-md font-bold">{stateFetchDefaultProfile.data.handle}</span>
                </Callout>
                <Switch>
                  <Match when={stateFetchOwnedProfiles.data.length > 1}>
                    <p class="font-semibold text-md mt-6 mb-3">Change your default account</p>
                    <p class="text-neutral-500 italic">Select the default account you want to use on Gashapon.</p>
                    <div class="w-full max-w-screen-xs mt-6">
                      <FormSelectDefaultProfile />
                    </div>
                  </Match>

                  <Match when={stateFetchOwnedProfiles.data.length <= 1}>
                    <p class="font-semibold text-md mt-6 mb-3">You don't have any other account.</p>
                  </Match>
                </Switch>
              </div>
            </Match>
          </Switch>
        </Show>
      </main>
    </>
  )
}
