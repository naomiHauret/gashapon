import Callout from '@components/Callout'
import Button from '@components/Button'
import { Match, Show, Switch } from 'solid-js'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import FormSelectDefaultAccount from '../FormSelectDefaultAccount'
import useDeleteAccount from './useDeleteAccount'

export const StateAccountSelected = () => {
  //@ts-ignore
  const { stateFetchDefaultProfile, stateFetchOwnedProfiles } = useDefaultProfile()
  const { stateDeleteAccount, deleteCurrentAccount, showWaitMessage } = useDeleteAccount()

  return (
    <>
      <section class="mt-6 px-4 pb-6 pt-4 rounded-md border border-white border-opacity-10">
        <Switch>
          <Match when={stateFetchOwnedProfiles.data.length > 1}>
            <h2 class="font-semibold text-md mb-3">Change your default account</h2>
            <p class="text-neutral-500 italic">Select the default account you want to use on Gashapon.</p>
            <div class="w-full mt-6">
              <FormSelectDefaultAccount />
            </div>
          </Match>

          <Match when={stateFetchOwnedProfiles.data.length <= 1}>
            <p class="font-semibold text-md mb-3">You don't have any other account.</p>
          </Match>
        </Switch>
      </section>
      <section class="mt-6 px-4 pb-6 pt-4 rounded-md border border-opacity-40 border-negative-500">
        <Show when={stateDeleteAccount.isLoading && showWaitMessage() === true}>
          <Callout class="mb-6 animate-appear">
            Looks like indexing this transaction is taking a bit of time, please wait a bit more or reload the page.
          </Callout>
        </Show>
        <h2 class="font-semibold text-md mb-3">Delete account</h2>
        <p class="mb-3 font-bold text-[1.095rem]">Warning: deleting your profile is permanent!</p>
        <h3 class="font-bold mb-3">What does it mean ?</h3>
        <p>
          All the data associated to{' '}
          <span class="font-bold text-brand-pink">@{stateFetchDefaultProfile.data.handle}</span> (posts, communities,
          games, follows, comments...) will be <span class="font-bold">wiped out immediately </span> and you{' '}
          <span class="font-bold">won’t be able to access them or restore them</span>.
        </p>
        <p class="my-4">
          Your handle <span class="font-bold text-brand-pink">@{stateFetchDefaultProfile.data.handle}</span> will also
          be up for grabs.
        </p>
        <p class="font-bold mb-6">Only delete your account if you're ok with this.</p>
        <Button
          disabled={stateDeleteAccount.isLoading}
          isLoading={stateDeleteAccount.isLoading}
          onClick={deleteCurrentAccount}
          intent="danger"
        >
          <Show when={stateDeleteAccount.isError === false && !stateDeleteAccount.isLoading}>Delete account</Show>
          <Show when={stateDeleteAccount.isLoading}>Deleting account...</Show>
          <Show when={stateDeleteAccount.isError === true}>Try again</Show>
        </Button>
      </section>
    </>
  )
}

export default StateAccountSelected
