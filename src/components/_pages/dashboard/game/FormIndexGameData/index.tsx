import * as tagsInput from '@zag-js/tags-input'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { Button } from '@components/Button'
import { createMemo, createUniqueId, Show } from 'solid-js'
import useIndexGameData from './useIndexGameData'
import FieldsetGameInfo from './FieldsGameInfo'
import FieldsetSystemRequirements from './FieldsSystemRequirements'
import FieldsetMedias from './FieldsMedias'
import FieldsetLinks from './FieldsLinks'
import styles from './styles.module.css'
import PreviewGameData from './PreviewGameData'
import { Portal } from 'solid-js/web'
import DialogTrackProgressDataIndexing from './DialogTrackProgressDataIndexing'
import { createTiptapEditor } from 'solid-tiptap'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Iframe from '@components/tiptap/Iframe'

export const FormIndexGameData = (props) => {
  const {
    storeForm,
    showWaitMessage,
    stateUploadNewGameData,
    stateIndexGameData,
    gameThumbnailSrc,
    onInputGameThumbnailChange,
    stateUploadGameThumbnail,
    removeThumbnail,
    fileGameThumbnail,
    gameBannerSrc,
    fileGameBanner,
    onInputGameBannerChange,
    stateUploadGameBanner,
    removeBanner,
    mediasSrc,
    onInputMediasChange,
    stateUploadGameMedias,
    filesMedias,
    removeMedia,
    apiDialogModalTrackProgress,
  } = useIndexGameData({
    initialData: props?.initialData,
    reference: props?.reference,
  })
  let refGameDescriptionTipTapEditor!: HTMLDivElement
  const { form } = storeForm
  const [stateTagsInput, sendtagsInput] = useMachine(
    tagsInput.machine({
      id: createUniqueId(),
      value: props?.initialData?.tags ?? [],
      name: 'tags',
      max: 10,
      blurBehavior: 'clear',
      onChange(tags) {
        storeForm.setData('tags', tags.values)
      },
    }),
  )

  const apiTagsInput = createMemo(() => tagsInput.connect(stateTagsInput, sendtagsInput, normalizeProps))

  const gameDescriptionTipTapEditor = createTiptapEditor({
    get element() {
      return refGameDescriptionTipTapEditor
    },
    get extensions() {
      return [
        StarterKit,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image'],
          alignments: ['left', 'right', 'center'],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'link',
            target: '_blank',
          },
        }),
        Iframe,
      ]
    },
    content: props?.initialData?.description ?? '<p>Start here</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert p-3 flex-grow focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      storeForm.setData('description', content)
    },
  })

  return (
    <>
      <div class={`grid ${styles.gridTemplate} relative gap-8`}>
        {/* @ts-ignore */}
        <form class="col-span-2 md:col-span-1" use:form>
          <fieldset>
            <legend class="font-bold text-ex text-neutral-500 mb-2">Game info</legend>
            <div class="space-y-6">
              <FieldsetGameInfo
                initialData={props?.initialData}
                gameThumbnailSrc={gameThumbnailSrc}
                onInputGameThumbnailChange={onInputGameThumbnailChange}
                removeThumbnail={removeThumbnail}
                storeForm={storeForm}
                apiTagsInput={apiTagsInput}
                ref={refGameDescriptionTipTapEditor}
                gameDescriptionTipTapEditor={gameDescriptionTipTapEditor}
              />
            </div>
          </fieldset>

          <fieldset class="mt-6">
            <legend class="font-bold text-ex text-neutral-500 mb-2">System requirements</legend>
            <div class="space-y-6">
              <FieldsetSystemRequirements initialData={props?.initialData} />
            </div>
          </fieldset>
          <fieldset class="mt-6">
            <legend class="font-bold text-ex text-neutral-500 mb-2">Medias</legend>
            <div class="space-y-6">
              <FieldsetMedias
                storeForm={storeForm}
                initialData={props?.initialData}
                gameBannerSrc={gameBannerSrc}
                onInputGameBannerChange={onInputGameBannerChange}
                removeBanner={removeBanner}
                removeMedia={removeMedia}
                mediasSrc={mediasSrc}
                onInputMediasChange={onInputMediasChange}
              />
            </div>
          </fieldset>
          <fieldset class="mt-6">
            <legend class="font-bold text-ex text-neutral-500 mb-2">Links</legend>
            <div class="space-y-6">
              <FieldsetLinks initialData={props?.initialData} />
            </div>
          </fieldset>
          <Button
            class="w-full xs:w-auto mt-8"
            disabled={
              stateUploadNewGameData.isLoading ||
              mediasSrc() === null ||
              (mediasSrc() !== null && mediasSrc()?.length === 0) ||
              gameBannerSrc() === null ||
              gameThumbnailSrc() === null ||
              !storeForm.isValid()
            }
            isLoading={stateUploadNewGameData.isLoading}
          >
            <Show when={stateUploadNewGameData.isError === false && !stateUploadNewGameData.isLoading}>Index game</Show>
            <Show when={stateUploadNewGameData.isLoading}>Indexing your game...</Show>
            <Show when={stateUploadNewGameData.isError === true}>Try again</Show>
          </Button>
        </form>
        <div class="hidden md:block md:col-span-1 relative text-2xs">
          <div class="md:sticky md:top-5 flex flex-col">
            <PreviewGameData storeForm={storeForm} gameThumbnailSrc={gameThumbnailSrc} />
          </div>
        </div>
      </div>
      {apiDialogModalTrackProgress().isOpen && (
        <Portal>
          <DialogTrackProgressDataIndexing
            api={apiDialogModalTrackProgress}
            fileGameThumbnail={fileGameThumbnail}
            stateUploadGameThumbnail={stateUploadGameThumbnail}
            fileGameBanner={fileGameBanner}
            stateUploadGameBanner={stateUploadGameBanner}
            filesMedias={filesMedias}
            stateUploadGameMedias={stateUploadGameMedias}
            stateUploadNewGameData={stateUploadNewGameData}
            stateIndexGameData={stateIndexGameData}
            showWaitMessage={showWaitMessage}
          />
        </Portal>
      )}
    </>
  )
}

export default FormIndexGameData
