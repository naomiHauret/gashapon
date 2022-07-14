import { PORTAL, SKYNET_SEED_PREFIX } from '@config/skynet'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { genKeyPairFromSeed } from 'skynet-js'
import { createContext, useContext } from 'solid-js'
import { client } from '@config/skynet'
import useToast from '@hooks/useToast'
import { string } from 'solid-use'

const ContextSkynet = createContext()

export function ProviderSkynet(props) {
  const toast = useToast()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()

  function getKeys() {
    const seed = `${SKYNET_SEED_PREFIX}.${stateFetchDefaultProfile.data.id}`
    return genKeyPairFromSeed(seed)
  }

  async function uploadData({
    file,
    successMessage,
    errorMessage,
    silentUpload,
  }: {
    file: File
    successMessage?: string
    errorMessage?: string
    silentUpload?: boolean
  }) {
    try {
      const uploaded = await client.uploadFile(file)
      if (!silentUpload) {
        //@ts-ignore
        toast().create({
          type: 'success',
          title: successMessage ?? 'Data uploaded successfully!',
        })
      }
      return `${PORTAL}/${uploaded.skylink.replace('sia://', '')}`
    } catch (error) {
      if (!silentUpload) {
        //@ts-ignore
        toast().create({
          type: 'error',
          title: errorMessage ?? "Something went wrong and we couldn't upload those data.",
        })
      }
      console.error(error)
    }
  }

  async function loadFileContent(skylink) {
    try {
      const result = await client.getFileContent(skylink)
      return result
    } catch (error) {
      //@ts-ignore
      toast().create({
        type: 'error',
        title: "Something went wrong and we couldn't load the content of this file.",
      })
      console.error(error)
    }
  }
  const store = {
    uploadData,
    loadFileContent,
  }
  return <ContextSkynet.Provider value={store}>{props.children}</ContextSkynet.Provider>
}

export function useSkynet() {
  return useContext(ContextSkynet)
}

export default useSkynet
