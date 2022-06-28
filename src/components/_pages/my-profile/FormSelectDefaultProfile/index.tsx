import Button from '@components/Button'
import Callout from '@components/Callout'
import FormSelect from '@components/FormSelect'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { For, Show } from 'solid-js'
import styles from './styles.module.css'
import useSelectDefaultProfile from './useSelectDefaultProfile'

export const FormSelectDefaultProfile = () => {
  //@ts-ignore
  const { stateFetchOwnedProfiles, stateFetchDefaultProfile } = useDefaultProfile()

  const { storeForm, stateSetDefaultProfile, showWaitMessage } = useSelectDefaultProfile()
  const { form } = storeForm

  //@ts-ignore
  return (
    <>
      <Show when={stateFetchOwnedProfiles.isLoading && showWaitMessage() === true}>
        <Callout class="mb-6 animate-appear">
          Looks like indexing your profile is taking a bit of time, please wait a bit more or reload the page.
        </Callout>
      </Show>
      <form use:form>
        <legend class="sr-only">Select your default account</legend>

        <fieldset class="mb-8 font-mono text-md">
          <FormSelect class="w-full" name="defaultAccount" id="defaultAccount">
            <option disabled>Select your new default account</option>
            <For
              each={
                stateFetchDefaultProfile.data?.handle
                  ? stateFetchOwnedProfiles.data.filter(
                      (profile) => profile.handle !== stateFetchDefaultProfile.data?.handle,
                    )
                  : stateFetchOwnedProfiles.data
              }
            >
              {/* @ts-ignore */}
              {(account) => <option value={`${account.handle}`}>{account.handle}</option>}
            </For>
          </FormSelect>
        </fieldset>
        <Button disabled={stateSetDefaultProfile.isLoading} isLoading={stateSetDefaultProfile.isLoading}>
          <Show when={stateSetDefaultProfile.isError === false && !stateSetDefaultProfile.isLoading}>
            Set default profile
          </Show>
          <Show when={stateSetDefaultProfile.isLoading}>Setting your default profile...</Show>
          <Show when={stateSetDefaultProfile.isError === true}>Try again</Show>
        </Button>
      </form>
    </>
  )
}

export default FormSelectDefaultProfile
