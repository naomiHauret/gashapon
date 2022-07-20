import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import { IconCamera, IconCameraPlus, IconCircleSolidClose } from '@components/Icons'
import { For, Show } from 'solid-js'

export const FieldsMedias = (props) => {
  return (
    <>
      <FormField>
        <FormField.InputField>
          <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
            <div>
              <FormField.Label for="banner">Game banner</FormField.Label>
              <FormField.Description id="input-banner-description">
                An alternative image to represent your game. <br />
                Click on the picture to upload a custom image from your files.
              </FormField.Description>
            </div>
            <div class="input-file_wrapper w-full h-auto rounded-md overflow-hidden aspect-banner relative bg-gray-100 bg-opacity-20">
              <input
                onChange={(e) => {
                  //@ts-ignore
                  props.onInputGameBannerChange(e.target.files[0])
                }}
                class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                name="banner"
                id="banner"
                aria-describedby="input-banner-description input-banner-helpblock"
              />
              <Show when={props.gameBannerSrc() !== null && props.gameBannerSrc()}>
                <button
                  onClick={props.removeBanner}
                  type="button"
                  class="absolute z-40 text-md top-0.5 inline-end-0.5 rounded-full p-0.5 text-neutral-100"
                >
                  <span class="sr-only">Remove banner picture</span>
                  <IconCircleSolidClose />
                </button>
              </Show>
              <div class="absolute w-full h-full rounded-md inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                <IconCamera class="text-2xl text-white" />
              </div>

              <Show when={props.gameBannerSrc() !== null && props.gameBannerSrc()}>
                <img
                  loading="lazy"
                  width="268"
                  height="112"
                  alt=""
                  class="absolute w-full h-full object-cover block z-10 inset-0"
                  src={props.gameBannerSrc()}
                />
              </Show>
            </div>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-banner-helpblock">
          A 3:1 ratio picture. We recommend it to be less than 2MB.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
            <div>
              <FormField.Label for="medias">Gameplay and in-game screenshots</FormField.Label>
              <FormField.Description id="input-medias-description">
                Screenshots of your game. <br />
                Click on the picture to upload custom images from your files.
              </FormField.Description>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div class="input-file_wrapper col-span-1 rounded-md overflow-hidden aspect-video relative border-2 border-dashed border-white border-opacity-20">
              <input
                onChange={(e) => {
                  //@ts-ignore
                  if (e.target.files.length > 12) {
                    //@ts-ignore
                    toast().create({
                      type: 'error',
                      title: "You can't upload more than 12 images.",
                    })
                    return
                  } else {
                    //@ts-ignore
                    props.onInputMediasChange(e.target.files)
                  }
                }}
                class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                type="file"
                multiple
                accept="image/*"
                name="medias"
                id="medias"
                aria-describedby="input-medias-description input-medias-helpblock"
              />

              <div class="absolute w-full h-full rounded-md inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                <IconCameraPlus class="text-2xl text-white" />
              </div>
            </div>
            <Show when={props.mediasSrc() !== null && props.mediasSrc()}>
              <For each={props.mediasSrc()}>
                {(media, index) => (
                  <div class="col-span-1 aspect-video relative">
                    <button
                      onClick={() => props.removeMedia(index())}
                      type="button"
                      class="absolute z-20 text-md top-0.5 inline-end-0.5 rounded-full p-0.5 text-neutral-100"
                    >
                      <span class="sr-only">Remove this picture</span>
                      <IconCircleSolidClose />
                    </button>
                    <div class="absolute w-full h-full inset-0 z-10 bg-black bg-opacity-50" />
                    {/* @ts-ignore */}
                    <img class="w-full rounded-md overflow-hidden h-full object-cover" src={media} alt="" />
                  </div>
                )}
              </For>
            </Show>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-medias-helpblock">
          A maximum of 12 pictures, preferrably in a 16:9. Each should be less than 2MB.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label class="items-baseline" for="videoTrailerUrl">
            <span class="mie-1ex">Video trailer </span>{' '}
            <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
          </FormField.Label>
          <FormField.Description id="input-videoTrailerUrl-description">
            A link to the trailer of your game.
          </FormField.Description>
          <FormInput
            value={props?.initialData?.videoTrailerUrl}
            type="url"
            name="videoTrailerUrl"
            id="videoTrailerUrl"
            class="w-full"
            aria-describedby="input-videoTrailerUrl-description input-developmentTeam-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-videoTrailerUrl-helpblock">
          The trailer link must be a valid URL. We recommend you to use a decentralized video service like{' '}
          <a href="https://lenstube.xyz/" target="_blank" rel="nofollow noreferrer">
            Lenstube
          </a>{' '}
          or{' '}
          <a href="https://odysee.com/" target="_blank" rel="nofollow noreferrer">
            Odysee
          </a>
          , but you can use also use Youtube.
        </FormField.HelpBlock>
      </FormField>
    </>
  )
}
export default FieldsMedias
