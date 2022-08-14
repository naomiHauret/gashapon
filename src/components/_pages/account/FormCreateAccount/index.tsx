import Button from '@components/Button'
import Callout from '@components/Callout'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import { Show } from 'solid-js'
import useCreateAccount from './useCreateAccount'

export const FormCreateAccount = () => {
  const { storeForm, stateCreateAccount, showWaitMessage } = useCreateAccount()
  const { form } = storeForm

  return (
    <>
      <Show when={stateCreateAccount.isLoading && showWaitMessage() === true}>
        <Callout class="mb-6 animate-appear">
          Looks like indexing your profile is taking a bit of time, please wait a bit more or reload the page.
        </Callout>
      </Show>
      {/* @ts-ignore */}
      <form use:form>
        <fieldset
          class="space-y-5 mb-8"
          classList={{
            'animate-pulse pointer-events-none': stateCreateAccount.isLoading,
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
                disabled={stateCreateAccount.isLoading}
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
        <Button
          class="w-full xs:w-auto"
          disabled={stateCreateAccount.isLoading || !storeForm.isValid()}
          isLoading={stateCreateAccount.isLoading}
        >
          <Show when={stateCreateAccount.isError === false && !stateCreateAccount.isLoading}>Claim handle</Show>
          <Show when={stateCreateAccount.isLoading}>Claiming handle...</Show>
          <Show when={stateCreateAccount.isError === true}>Try again</Show>
        </Button>
      </form>
    </>
  )
}

export default FormCreateAccount
