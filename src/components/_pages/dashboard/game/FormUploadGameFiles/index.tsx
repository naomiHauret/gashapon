import Button from '@components/Button'
import { Show } from 'solid-js'
import useUploadGameFiles from './useUploadGameFiles'

export const FormUploadGameFiles = () => {
  const { storeForm, stateUploadGameFile } = useUploadGameFiles()
  const { form } = storeForm
  return (
    <>
      <h3 class="font-bold text-md mb-2">Upload new files</h3>
      <p class="mb-4 text-neutral-400 italic">Note: uploading new files will erase the previous ones.</p>
      {/*@ts-ignore */}
      <form use:form>
        <div class="mb-8 rounded-lg bg-white bg-opacity-0 hover:bg-opacity-3.5 focus-within:bg-opacity-5 flex flex-col items-center justify-center w-full border-dashed border-2 border-neutral-500 focus-within:border-neutral-400 relative aspect-video">
          <label for="gameFile" class="text-center p-8 mx-auto text-sm font-medium italic text-neutral-300">
            Upload a <span class="font-mono text-md text-white font-bold">.zip, .tar.gz .gz, .rar or .7zip</span>
            &nbsp;&nbsp;file containing your game files. <br />
            <br />
            Your file can also include installation instructions.
          </label>
          <Show when={storeForm.data()?.gameFile}>
            <span class="font-bold text-brand-yellow font-mono py-4">{storeForm.data()?.gameFile.name}</span>
          </Show>
          <input
            disabled={stateUploadGameFile.isLoading === true}
            name="gameFile"
            id="gameFile"
            class="absolute w-full h-full top-0 left-0 z-10 opacity-0 cursor-pointer"
            type="file"
            accept=".zip,.rar,.7zip,.gz,.tar.gz"
          />
        </div>
        <Button
          isLoading={stateUploadGameFile.isLoading}
          disabled={!storeForm.isValid() || stateUploadGameFile.isLoading}
        >
          <Show when={!stateUploadGameFile.isLoading && !stateUploadGameFile.isError}>Upload</Show>
          <Show when={stateUploadGameFile.isLoading}>Uploading...</Show>
          <Show when={stateUploadGameFile.isError}>Try again</Show>
        </Button>
      </form>
    </>
  )
}

export default FormUploadGameFiles
