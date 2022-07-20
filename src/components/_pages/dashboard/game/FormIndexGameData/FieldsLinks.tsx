import FormField from '@components/FormField'
import FormInput from '@components/FormInput'

export const FieldsLinks = (props) => {
  return (
    <>
      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="website">
            <span class="mie-1ex">Official website</span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-website-description">
            The official website of your game.
          </FormField.Description>
          <FormInput
            type="url"
            name="website"
            id="website"
            class="w-full"
            value={props?.initialData?.website}
            aria-describedby="input-website-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-website-helpblock">
          The official website of your game must be a valid URL.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="itchUrl">
            <span class="mie-1ex">itch.io page</span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-itchUrl-description">The itch.io page of your game.</FormField.Description>
          <FormInput
            value={props?.initialData?.itchUrl}
            type="url"
            name="itchUrl"
            id="itchUrl"
            class="w-full"
            aria-describedby="input-itchUrl-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-itchUrl-helpblock">
          The itch.io page of your game must be a valid URL.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="steamUrl">
            <span class="mie-1ex">Steam page</span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-steamUrl-description">The Steam page of your game.</FormField.Description>
          <FormInput
            value={props?.initialData?.steamUrl}
            type="url"
            name="steamUrl"
            id="steamUrl"
            class="w-full"
            aria-describedby="input-steamUrl-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-steamUrl-helpblock">
          The Steam page of your game must be a valid URL.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="googlePlayUrl">
            <span class="mie-1ex">Google Play page</span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-googlePlayUrl-description">
            The Google Play page of your game.
          </FormField.Description>
          <FormInput
            value={props?.initialData?.googlePlayUrl}
            type="url"
            name="googlePlayUrl"
            id="googlePlayUrl"
            class="w-full"
            aria-describedby="input-googlePlayUrl-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-googlePlayUrl-helpblock">
          The Google Play page of your game must be a valid URL.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="appleAppStoreUrl">
            <span class="mie-1ex">Apple App Store page</span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-appleAppStoreUrl-description">
            The Apple App Store page of your game.
          </FormField.Description>
          <FormInput
            value={props?.initialData?.appleAppStoreUrl}
            type="url"
            name="appleAppStoreUrl"
            id="appleAppStoreUrl"
            class="w-full"
            aria-describedby="input-appleAppStoreUrl-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-appleAppStoreUrl-helpblock">
          The Apple App Store page of your game must be a valid URL.
        </FormField.HelpBlock>
      </FormField>
    </>
  )
}

export default FieldsLinks
