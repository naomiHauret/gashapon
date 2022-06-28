import { Button } from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'

export const FormEditProfile = () => {
  return (
    <>
      <form class="w-full">
        <fieldset class="space-y-6 mb-8">
          <FormField>
            <FormField.InputField>
              <FormField.Label for="name">Your name</FormField.Label>
              <FormField.Description id="input-name-description">
                A display name you are comfortable with (your full name, first name, nickname ...)
              </FormField.Description>
              <FormInput
                class="lg:max-w-[155ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
                type="text"
                name="name"
                id="name"
                maxLength="150"
                aria-describedby="input-name-description input-name-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-name-helpblock">Please use at most 150 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="location">Where are you based ?</FormField.Label>
              <FormField.Description id="input-location-description">
                The place you call home (your city, country, planet...)
              </FormField.Description>
              <FormInput
                class="lg:max-w-[145ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
                type="text"
                name="location"
                id="location"
                maxLength="140"
                aria-describedby="input-location-description input-location-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-location-helpblock">Please use at most 140 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="bio">About you</FormField.Label>
              <FormField.Description id="input-bio-description">
                What do you want the world to know about you ?
              </FormField.Description>
              <FormTextarea
                class="lg:max-w-[245ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
                type="text"
                name="bio"
                id="bio"
                maxLength="240"
                aria-describedby="input-bio-description input-bio-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-bio-helpblock">Please use at most 240 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="url">Your website</FormField.Label>
              <FormField.Description id="input-url-description">Your personal website</FormField.Description>
              <FormInput
                addonStart="https://"
                class="lg:max-w-[245ex] max-w-full w-auto 2xs:w-full lg:w-3/4"
                placeholder="example.xyz"
                appearance="square-addon-start"
                type="url"
                name="url"
                id="url"
                maxLength="240"
                aria-describedby="input-url-description input-url-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-url-helpblock">
              Please type a valid URL that is at most 240 characters.
            </FormField.HelpBlock>
          </FormField>
        </fieldset>
        <Button>Edit profile</Button>
      </form>
    </>
  )
}

export default FormEditProfile
