import { Button } from '@components/Button'
import Callout from '@components/Callout'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import { IconCamera } from '@components/Icons'
import { Show } from 'solid-js'
import useEditProfile from './useEditProfile'

export const FormEditProfile = () => {
  const {
    storeForm,
    stateEditProfile,
    showWaitMessage,
    onInputProfilePictureChange,
    onInputProfileBannerChange,
    profilePictureSrc,
    profileBannerSrc,
  } = useEditProfile()
  const { form } = storeForm
  return (
    <>
      <Show when={stateEditProfile.isLoading && showWaitMessage() === true}>
        <Callout class="mb-6 animate-appear">
          Looks like indexing your profile updates is taking a bit of time, please wait a bit more or reload the page.
        </Callout>
      </Show>
      {/* @ts-ignore */}
      <form use:form class="w-full">
        <fieldset class="space-y-6">
          <FormField>
            <FormField.InputField>
              <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
                <div>
                  <FormField.Label for="profile-banner">Your banner</FormField.Label>
                  <FormField.Description id="input-profile-banner-description">
                    An image displayed on top of your profile. <br />
                    Click on the picture to upload a custom image from your files.
                  </FormField.Description>
                </div>
                <div class="h-28 rounded-md overflow-hidden aspect-banner relative bg-gray-100 bg-opacity-20">
                  <input
                    onChange={(e) => {
                      //@ts-ignore
                      onInputProfileBannerChange(e.target.files[0])
                    }}
                    class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                    type="file"
                    accept="image/*"
                    name="profile-banner"
                    id="profile-banner"
                    aria-describedby="input-profile-banner-description input-profile-banner-helpblock"
                  />

                  <div class="absolute w-full h-full rounded-md inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                    <IconCamera class="text-2xl text-white" />
                  </div>
                  <Show when={profileBannerSrc() !== null && profileBannerSrc()}>
                    <img
                      loading="lazy"
                      width="268"
                      height="112"
                      alt=""
                      class="absolute w-full h-full object-cover block z-10 inset-0"
                      src={profileBannerSrc()}
                    />
                  </Show>
                </div>
              </div>
            </FormField.InputField>
            <FormField.HelpBlock id="input-profile-banner-helpblock">
              A 3:1 ratio picture. We recommend it to be minimum 568x189, maximum 1500x500 and less than 5MB.
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
                <div>
                  <FormField.Label for="profile-picture">Your profile picture</FormField.Label>
                  <FormField.Description id="input-profile-picture-description">
                    An image you want to be represented by. <br />
                    Click on the picture to upload a custom image from your files.
                  </FormField.Description>
                </div>
                <div class="h-28 w-28 rounded-full overflow-hidden relative bg-gray-100 bg-opacity-20">
                  <input
                    onChange={(e) => {
                      //@ts-ignore
                      onInputProfilePictureChange(e.target.files[0])
                    }}
                    class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                    type="file"
                    accept="image/*"
                    name="profile-picture"
                    id="profile-picture"
                    aria-describedby="input-profile-picture-description input-profile-picture-helpblock"
                  />
                  <div class="absolute w-full h-full rounded-full inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                    <IconCamera class="text-2xl text-true-white" />
                  </div>
                  <Show when={profilePictureSrc() !== null}>
                    <img
                      alt=""
                      loading="lazy"
                      width="112"
                      height="112"
                      class="absolute w-full h-full object-cover block z-10 inset-0"
                      src={profilePictureSrc()}
                    />
                  </Show>
                </div>
              </div>
            </FormField.InputField>
            <FormField.HelpBlock id="input-profile-picture-helpblock">
              A 1:1 ratio picture. We recommend it to be minimum 120x120, maximum 160x160 and less than 1MB.
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="name">Your name</FormField.Label>
              <FormField.Description id="input-name-description">
                A display name you are comfortable with (your full name, first name, nickname ...)
              </FormField.Description>
              <FormInput
                class="w-full 2xs:max-w-[40ex]"
                type="text"
                name="name"
                id="name"
                maxlength="30"
                value={storeForm.data().name}
                aria-describedby="input-name-description input-name-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-name-helpblock">Please use at most 30 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="location">Where are you based ?</FormField.Label>
              <FormField.Description id="input-location-description">
                The place you call home (your city, country, planet...)
              </FormField.Description>
              <FormInput
                value={storeForm.data()?.location}
                type="text"
                name="location"
                id="location"
                class="w-full 2xs:max-w-[40ex]"
                maxlength="30"
                aria-describedby="input-location-description input-location-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-location-helpblock">Please use at most 30 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="bio">About you</FormField.Label>
              <FormField.Description id="input-bio-description">
                What do you want the world to know about you ?
              </FormField.Description>
              <FormTextarea
                type="text"
                name="bio"
                value={storeForm.data().bio}
                class="w-full 2xs:max-w-[210ex]"
                id="bio"
                maxLength="200"
                aria-describedby="input-bio-description input-bio-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-bio-helpblock">Please use at most 200 characters.</FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="twitter">Your Twitter handle</FormField.Label>
              <FormField.Description id="input-twitter-description">
                The username that appears at the end of your unique Twitter URL.
              </FormField.Description>
              <FormInput
                value={storeForm.data().twitter}
                addonStart="twitter.com/"
                appearance="square-addon-start"
                name="twitter"
                id="twitter"
                class="w-full 2xs:max-w-[25ex]"
                maxlength="15"
                aria-describedby="input-twitter-description input-twitter-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-twitter-helpblock">
              Please type a valid Twitter handle (1 to 15 characters).
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="itch">Your itch handle</FormField.Label>
              <FormField.Description id="input-itch-description">
                The username that appears at the end of your unique itch.io URL.
              </FormField.Description>
              <FormInput
                value={storeForm.data().itch}
                addonStart="itch.io/profile/"
                appearance="square-addon-start"
                name="itch"
                id="itch"
                class="w-full 2xs:max-w-[35ex]"
                maxlength="25"
                aria-describedby="input-itch-description input-itch-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-itch-helpblock">
              Please type a valid itch handle (2 to 25 characters).
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="twitch">Your Twitch handle</FormField.Label>
              <FormField.Description id="input-twitch-description">
                The username that appears at the end of your unique twitch.tv URL.
              </FormField.Description>
              <FormInput
                value={storeForm.data().twitch}
                addonStart="twitch.tv/"
                appearance="square-addon-start"
                name="twitch"
                id="twitch"
                class="w-full 2xs:max-w-[35ex]"
                maxlength="25"
                aria-describedby="input-twitch-description input-twitch-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-twitch-helpblock">
              Please type a valid twitch handle (4 to 25 characters).
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="website">Your website</FormField.Label>
              <FormField.Description id="input-website-description">Your personal website</FormField.Description>
              <FormInput
                value={storeForm.data().website}
                placeholder="https://example.xyz"
                type="url"
                name="website"
                id="website"
                class="w-full 2xs:max-w-[210ex]"
                maxlength="200"
                aria-describedby="input-website-description input-website-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-website-helpblock">
              Please type a valid URL that is at most 200 characters.
            </FormField.HelpBlock>
          </FormField>
        </fieldset>
        <fieldset class="space-y-6">
          <FormField>
            <FormField.InputField>
              <FormField.Label for="layerColor">Your profile page background color</FormField.Label>
              <FormField.Description id="input-layerColor-description">
                The color displayed in the background of your profile page.
              </FormField.Description>
              <FormInput
                value={storeForm.data().layerColor}
                name="layerColor"
                id="layerColor"
                class="w-auto"
                type="color"
                aria-describedby="input-layerColor-description input-layerColor-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-layerColor-helpblock">
              Please pick a color (preferrably darker than your accent color).
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="accentColor">Your profile page accent color</FormField.Label>
              <FormField.Description id="input-accentColor-description">
                The color used for user elements like buttons in your profile page.
              </FormField.Description>
              <FormInput
                value={storeForm.data().accentColor}
                name="accentColor"
                id="accentColor"
                class="w-auto"
                type="color"
                aria-describedby="input-accentColor-description input-accentColor-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock id="input-accentColor-helpblock">
              Please pick a color (preferrably lighter than your background color).
            </FormField.HelpBlock>
          </FormField>
        </fieldset>
        <Button
          class="w-full xs:w-auto mt-8"
          disabled={stateEditProfile.isLoading}
          isLoading={stateEditProfile.isLoading}
        >
          <Show when={stateEditProfile.isError === false && !stateEditProfile.isLoading}>Edit profile</Show>
          <Show when={stateEditProfile.isLoading}>Editing your profile...</Show>
          <Show when={stateEditProfile.isError === true}>Try again</Show>
        </Button>
      </form>
    </>
  )
}

export default FormEditProfile
