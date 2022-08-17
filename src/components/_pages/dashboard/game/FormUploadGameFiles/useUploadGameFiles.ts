import LitJsSdk from 'lit-js-sdk'
import Lit, { chain } from '@config/lit'
import { string, object, instanceof as zodValidationInstanceOf } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createResource, createUniqueId } from 'solid-js'
import useToast from '@hooks/useToast'
import useSkynet from '@hooks/useSkynet'
import useDashboardGamePass from '@hooks/useDashboardGamePass'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { v4 as uuidv4 } from 'uuid'
import { createSignal } from 'solid-js'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'
import { PORTAL } from '@config/skynet'
import { login } from '@graphql/authentication/login'

const schema = object({
  gameFile: zodValidationInstanceOf(File),
})

const useStoreUploadGameFile = createAsyncStore()
const useStoreEncryptFileLocation = createAsyncStore()

export function useUploadGameFiles() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { uploadData, setDataLink, getEntryLink, getFileMetadata } = useSkynet()
  const toast = useToast()
  const stateUploadGameFile = useStoreUploadGameFile()
  const { refreshData, gamePassList } = useDashboardGamePass()

  const [stateDialogModalTrackProgress, sendDialogModalTrackProgress] = useMachine(
    dialog.machine({
      role: 'alertdialog',
      closeOnOutsideClick: false,
      closeOnEsc: false,
      preventScroll: true,

      id: createUniqueId(),
    }),
  )

  const apiDialogModalTrackProgress = createMemo(() =>
    dialog.connect(stateDialogModalTrackProgress, sendDialogModalTrackProgress, normalizeProps),
  )

  // Form
  const storeForm = createForm({
    onSubmit: async (values) => {
      console.log(values)
      console.log(gamePassList()?.data?.publications?.items)
      // await uploadGameFiles(values)
    },
    extend: validator({ schema }),
  })

  /*
    async function encrypt(str) {
        if (!this.litNodeClient) {
          await this.connect()
        }
    
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str)
    
        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
          accessControlConditions,
          symmetricKey,
          authSig,
          chain,
        })
    
        return {
          encryptedString,
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
      }
    
  
    
    async function uploadGameFiles(values) {
      apiDialogModalTrackProgress().open()
      stateEncryptGameFileLocation.setIsLoading(true)
      stateEncryptGameFileLocation.setIsSuccess(false)
      stateEncryptGameFileLocation.setError(null, false)
      stateUploadGameFile.setIsLoading(true)
      stateUploadGameFile.setIsSuccess(false)
      stateUploadGameFile.setError(null, false)

      const uuid = uuidv4().replace('-', '')
      try {
        await login()

          const url = await uploadData({
            file: values.gameFile,
            silentUpload: true,
          })
          const dataKey = uuid
          const skylink = url.skylink
    
          // set a registry entry to point at 'skylink'
          await setDataLink(dataKey, skylink)
    
          // get the resolver skylink which references the registry entry
          const resolverSkylink = await getEntryLink(stateFetchDefaultProfile.data.id, dataKey)
    
          stateUploadGameFile.setIsSuccess(true)
          stateUploadGameFile.setIsLoading(false)
          stateUploadGameFile.setError(null, false)
  
      } catch (e) {
        console.error(e)
        stateUploadGameFile.setError(e?.message ?? e, true)
        stateUploadGameFile.setIsLoading(false)
        stateUploadGameFile.setIsSuccess(false)
        stateEncryptGameFileLocation.setIsLoading(true)
        stateEncryptGameFileLocation.setIsSuccess(false)
        stateEncryptGameFileLocation.setError(null, false)
  
        //@ts-ignore
        !apiDialogModalTrackProgress()?.isOpen &&
          toast().create({
            type: 'error',
            title: `Something went wrong and we couldn't create your game: ${e?.message ?? e}`,
          })
        console.error(e)
      }
    }
  
    createEffect(() => {
      if (!apiDialogModalTrackProgress().isOpen) {
  
        stateEncryptGameFileLocation.setIsLoading(false)
        stateEncryptGameFileLocation.setIsSuccess(false)
        stateEncryptGameFileLocation.setError(null, false)
        stateUploadGameFile.setIsLoading(false)
        stateUploadGameFile.setIsSuccess(false)
        stateUploadGameFile.setError(null, false)
  
      }
    })
  
    */
  return {
    storeForm,
    stateUploadGameFile,
    apiDialogModalTrackProgress,
  }
}

export default useUploadGameFiles
