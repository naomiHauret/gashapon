import { PORTAL, SKYNET_SEED_PREFIX } from '@config/skynet'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { genKeyPairFromSeed, getEntryLink as _getEntryLink } from 'skynet-js'
import { createContext, useContext } from 'solid-js'
import { client } from '@config/skynet'
import useToast from '@hooks/useToast'

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
      return {
        https: `${PORTAL}/${uploaded.skylink.replace('sia://', '')}`,
        skylink: uploaded.skylink,
      }
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

  async function setDataLink(dataKey, skylink) {
    console.log(dataKey, skylink)
    const { privateKey, publicKey } = getKeys()
    try {
      await client.db.setDataLink(privateKey, dataKey, skylink)
    } catch (e) {
      console.error(e)
    }
  }

  async function getEntryLink(profileId, dataKey) {
    const seed = `${SKYNET_SEED_PREFIX}.${profileId}`
    const { publicKey } = genKeyPairFromSeed(seed)
    const resolverSkylink = _getEntryLink(publicKey, dataKey)

    return resolverSkylink
  }

  async function getFileMetadata(skylink) {
    try {
      const result = await client.getMetadata(skylink)
      return result
    } catch (error) {
      console.log(error)
    }
  }
  const store = {
    uploadData,
    loadFileContent,
    getKeys,
    setDataLink,
    getEntryLink,
    getFileMetadata,
  }
  return <ContextSkynet.Provider value={store}>{props.children}</ContextSkynet.Provider>
}

export function useSkynet() {
  return useContext(ContextSkynet)
}

export default useSkynet
