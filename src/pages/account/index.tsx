import { IconSpinner } from '@components/Icons'
import StateAccountNotCreated from '@components/_pages/account/StateAccountNotCreated'
import StateAccountNotSelected from '@components/_pages/account/StateAccountNotSelected'
import StateAccountSelected from '@components/_pages/account/StateAccountSelected'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect, Match, Show, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile, stateFetchOwnedProfiles } = useDefaultProfile()

  return (
    <>
      <Title>My profile - Gashapon</Title>
      <main>
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
            <Match when={stateFetchDefaultProfile.data === null && stateFetchOwnedProfiles.data.length === 0}>
              <StateAccountNotCreated />
            </Match>
            <Match
              when={
                stateFetchOwnedProfiles.data !== null &&
                stateFetchDefaultProfile.data === null &&
                stateFetchDefaultProfile.isError === false
              }
            >
              <div class="animate-appear w-full">
                <StateAccountNotSelected />
              </div>
            </Match>
            <Match when={stateFetchDefaultProfile.data !== null && stateFetchDefaultProfile.isError === false}>
              <div class="animate-appear w-full">
                <StateAccountSelected />
              </div>
            </Match>
          </Switch>
        </Show>
      </main>
    </>
  )
}
