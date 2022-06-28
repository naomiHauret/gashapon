import Button from '@components/Button'
import Callout from '@components/Callout'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import { Show } from 'solid-js'
import useCreateProfile from './useCreateProfile'

export const FormCreateProfile = () => {
  const { storeForm, stateCreateProfile, showWaitMessage } = useCreateProfile()
  const { form } = storeForm

  return (
    <>
      <Show when={stateCreateProfile.isLoading && showWaitMessage() === true}>
        <Callout class="mb-6 animate-appear">
          Looks like indexing your profile is taking a bit of time, please wait a bit more or reload the page.
        </Callout>
      </Show>
      {/* @ts-ignore */}
      <form use:form>
        <fieldset
          class="space-y-5 mb-8"
          classList={{
            'animate-pulse pointer-events-none': stateCreateProfile.isLoading,
          }}
        >
          <FormField>
            <FormField.InputField>
              <FormField.Label>Your profile handle</FormField.Label>
              <FormField.Description id="handle">
                Your handle is your username. It is unique to your account, and appears in your profile URL, your posts
                and your comments.
              </FormField.Description>
              <FormInput
                disabled={stateCreateProfile.isLoading}
                appearance="square-block"
                addonStart="@"
                addonEnd=".lens"
                name="handle"
                min="5"
                required
              />
            </FormField.InputField>
            <FormField.HelpBlock>Your handle must be min. 3 characters long.</FormField.HelpBlock>
          </FormField>
        </fieldset>
        <Button disabled={stateCreateProfile.isLoading} isLoading={stateCreateProfile.isLoading}>
          <Show when={stateCreateProfile.isError === false && !stateCreateProfile.isLoading}>Claim handle</Show>
          <Show when={stateCreateProfile.isLoading}>Claiming handle...</Show>
          <Show when={stateCreateProfile.isError === true}>Try again</Show>
        </Button>
      </form>
    </>
  )
}

export default FormCreateProfile
