import { string, object, instanceof as zodValidationInstanceOf } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createUniqueId } from 'solid-js'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useSkynet from '@hooks/useSkynet'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import omit from '@helpers/omit'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { v4 as uuidv4 } from 'uuid'
import { createSignal } from 'solid-js'
import { createPublicationTypedData } from '@graphql/publications/create'
import { LENS_PUBLICATIONS_APP_ID_GAMES_STORE } from '@config/lens'
import { PORTAL } from '@config/skynet'
import { login } from '@graphql/authentication/login'

const schema = object({
  // About
  title: string().trim(),
  status: string().trim(), // alpha, beta...
  genres: string().array(), // RPG, shoot em up...
  playerModes: string().array(), // Solo, co-op, multi, online...
  platforms: string().array(), // Web, PC, Android...
  tags: string().array(), // Anime, Zombies...
  productionType: string(),

  // Behind the game
  developmentTeam: string(),

  // Promo material & content
  tagline: string().trim().max(140),
  description: string().trim(),
  thumbnail: zodValidationInstanceOf(File).optional().or(string()),
  videoTrailerUrl: string().url().or(string().max(0)),
  banner: zodValidationInstanceOf(File).optional().or(string()),
  medias: zodValidationInstanceOf(File).array().optional().or(string()),
  website: string().url().or(string().max(0)),

  // Alternative distribution platforms
  itchUrl: string().url().or(string().max(0)),
  steamUrl: string().url().or(string().max(0)),
  googlePlayUrl: string().url().or(string().max(0)),
  appleAppStoreUrl: string().url().or(string().max(0)),

  // System requirements
  // --- Minimum
  minimumSystemRequirementsCpu: string().optional(),
  minimumSystemRequirementsGpu: string().optional(),
  minimumSystemRequirementsOs: string().optional(),
  minimumSystemRequirementsRam: string().optional(),
  minimumSystemRequirementsStorage: string().optional(),
  minimumSystemRequirementsAdditionalNotes: string().optional(),
  // --- Recommended
  recommendedSystemRequirementsCpu: string().optional(),
  recommendedSystemRequirementsGpu: string().optional(),
  recommendedSystemRequirementsOs: string().optional(),
  recommendedSystemRequirementsRam: string().optional(),
  recommendedSystemRequirementsStorage: string().optional(),
  recommendedSystemRequirementsAdditionalNotes: string().optional(),
})

const useStoreUploadGameThumbnail = createAsyncStore()
const useStoreUploadGameBanner = createAsyncStore()
const useStoreUploadGameMedias = createAsyncStore()
const useStoreUploadNewGameData = createAsyncStore()
const useStoreIndexGameData = createAsyncStore()

export function useIndexGameData(options) {
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

  //@ts-ignore
  const { uploadData, setDataLink, getEntryLink, getFileMetadata } = useSkynet()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const toast = useToast()
  const stateUploadGameThumbnail = useStoreUploadGameThumbnail()
  const stateUploadGameBanner = useStoreUploadGameBanner()
  const stateUploadGameMedias = useStoreUploadGameMedias()
  const stateUploadNewGameData = useStoreUploadNewGameData()
  const stateIndexGameData = useStoreIndexGameData()

  const { showWaitMessage, setCanStartCountdown, setShowWaitMessage } = useIndexingTxWaitMessage()

  // Game thumbnail
  const [gameThumbnailSrc, setGameThumbnailSrc] = createSignal(options?.initialData?.thumbnail ?? null)
  const [fileGameThumbnail, setFileGameThumbnail] = createSignal()

  // Game banner
  const [gameBannerSrc, setGameBannerSrc] = createSignal(options?.initialData?.banner ?? null)
  const [fileGameBanner, setFileGameBanner] = createSignal()

  // Game medias
  const [mediasSrc, setMediasSrc] = createSignal(options?.initialData?.medias ?? null)
  const [filesMedias, setFilesMedias] = createSignal()

  // Form
  const storeForm = createForm({
    initialValues: {
      ...options?.initialData,
    },
    onSubmit: async (values) => {
      await updateGameMetadata(values)
    },
    extend: validator({ schema }),
  })

  function onInputGameThumbnailChange(file) {
    const src = URL.createObjectURL(file)
    setGameThumbnailSrc(src)
    setFileGameThumbnail(file)
  }

  async function uploadGameThumbnail() {
    stateUploadGameThumbnail.setIsLoading(true)
    try {
      const url = await uploadData({ file: fileGameThumbnail(), silentUpload: true })
      setGameThumbnailSrc(url.https)
      stateUploadGameThumbnail.setIsSuccess(true)
      stateUploadGameThumbnail.setIsLoading(false)
      stateUploadGameThumbnail.setError(null, false)
    } catch (e) {
      console.error(e)
      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      stateIndexGameData.setError(e?.message ?? e, true)
      stateUploadGameThumbnail.setIsSuccess(false)
      stateUploadGameThumbnail.setIsLoading(false)
      stateUploadGameThumbnail.setError(e?.message ?? e, true)
    }
  }

  function onInputGameBannerChange(file) {
    const src = URL.createObjectURL(file)
    setGameBannerSrc(src)
    setFileGameBanner(file)
  }

  async function uploadGameBanner() {
    stateUploadGameBanner.setIsLoading(true)
    try {
      const url = await uploadData({ file: fileGameBanner(), silentUpload: true })
      setGameBannerSrc(url.https)
      stateUploadGameBanner.setIsSuccess(true)
      stateUploadGameBanner.setIsLoading(false)
      stateUploadGameBanner.setError(null, false)
    } catch (e) {
      console.error(e)
      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      stateIndexGameData.setError(e?.message ?? e, true)
      stateUploadGameBanner.setIsSuccess(false)
      stateUploadGameBanner.setIsLoading(false)
      stateUploadGameBanner.setError(e?.message ?? e, true)
    }
  }

  function onInputMediasChange(files) {
    //@ts-ignore
    const srcs = Array.from(files).map((file) => URL.createObjectURL(file))
    const arrayFiles = Array.from(files)

    const newMediasArray = mediasSrc() === null ? [] : mediasSrc()
    const newFilesArray = !filesMedias() ? [] : filesMedias()

    for (let i = 0; i < srcs.length; i++) {
      if (newMediasArray.length < 12) {
        newMediasArray.push(srcs[i])
        //@ts-ignore
        newFilesArray.push(arrayFiles[i])
      }
    }
    setMediasSrc([...newMediasArray])
    //@ts-ignore
    setFilesMedias([...newFilesArray])
  }
  gameThumbnailSrc() && gameThumbnailSrc() !== null

  function removeMedia(index) {
    const newMediasArray = mediasSrc().filter((media, i) => index !== i)
    //@ts-ignore
    const newFilesArray = filesMedias()?.filter((file, i) => index !== i)
    setMediasSrc([...newMediasArray])
    if (filesMedias()) setFilesMedias([...newFilesArray])
  }

  function removeBanner() {
    setGameBannerSrc(null)
    setFileGameBanner()
  }

  function removeThumbnail() {
    setGameThumbnailSrc(null)
    setFileGameThumbnail()
  }

  async function uploadGameMedias() {
    stateUploadGameMedias.setIsLoading(true)
    try {
      let uploadedFilesLinks = []
      //@ts-ignore
      for (let i = 0; i < filesMedias()?.length; i++) {
        const url = await uploadData({ file: filesMedias()[i], silentUpload: true })
        uploadedFilesLinks = [...uploadedFilesLinks, url.https]
      }
      setMediasSrc([...uploadedFilesLinks])
      stateUploadGameMedias.setIsSuccess(true)
      stateUploadGameMedias.setIsLoading(false)
      stateUploadGameMedias.setError(null, false)
    } catch (e) {
      console.error(e)
      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      stateIndexGameData.setError(e?.message ?? e, true)
      stateUploadGameMedias.setIsSuccess(false)
      stateUploadGameMedias.setIsLoading(false)
      stateUploadGameMedias.setError(e?.message ?? e, true)
    }
  }

  async function uploadGameData(jsonFile) {
    stateUploadNewGameData.setIsLoading(true)
    try {
      const url = await uploadData({
        file: jsonFile,
        silentUpload: true,
      })
      stateUploadNewGameData.setIsSuccess(true)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setError(null, false)
      return url
    } catch (e) {
      console.error(e)
      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      stateIndexGameData.setError(e?.message ?? e, true)
      stateUploadNewGameData.setIsSuccess(false)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setError(e?.message ?? e, true)
    }
  }

  async function updateGameMetadata(values) {
    stateIndexGameData.setIsLoading(true)
    stateIndexGameData.setError(null, false)
    apiDialogModalTrackProgress().open()
    const uuid = options?.reference ?? uuidv4()
    try {
      await login()
      // If thumbnail changed
      if (fileGameThumbnail()) {
        // Upload it to skynet
        await uploadGameThumbnail()
      }
      // If game banner changed
      if (fileGameBanner()) {
        // Upload it to skynet
        await uploadGameBanner()
      }
      // If game medias changed

      if (filesMedias()) {
        // Upload it to skynet
        await uploadGameMedias()
      }
      const thumbnailMetadata = fileGameThumbnail()
        ? //@ts-ignore
          fileGameThumbnail()?.type
        : await getFileMetadata(gameThumbnailSrc())
      const gameMetadata = {
        appId: LENS_PUBLICATIONS_APP_ID_GAMES_STORE,
        description: `${values.title} - Digital Gashapon Game Caspule`,
        content: `${values.title} is a game distributed on Gashapon.`,
        name: `${values.title} - Game info`,
        image: gameThumbnailSrc(),
        //@ts-ignore
        imageMimeType: thumbnailMetadata,
        attributes: [
          {
            displayType: 'string',
            value: 'game-info',
            traitType: 'type',
          },
          {
            displayType: 'string',
            value: uuid,
            traitType: 'reference',
          },
          {
            displayType: 'string',
            value: values.title ?? null,
            traitType: 'title',
          },
          {
            displayType: 'string',
            value: values.developmentTeam ?? null,
            traitType: 'developmentTeam',
          },
          {
            displayType: 'string',
            value: values.productionType,
            traitType: 'productionType',
          },
          {
            displayType: 'string',
            value: values.status ?? null,
            traitType: 'status',
          },
          {
            displayType: 'string',
            value: values.tagline ?? null,
            traitType: 'tagline',
          },
          {
            displayType: 'string',
            value: values.description ?? null,
            traitType: 'description',
          },
          {
            displayType: 'string',
            value: values?.genres ? values?.genres.join(';') : null,
            traitType: 'genres',
          },
          {
            displayType: 'string',
            value: values?.tags ? values?.tags.join(';') : null,
            traitType: 'tags',
          },
          {
            displayType: 'string',
            value: values?.playerModes ? values?.playerModes.join(';') : null,
            traitType: 'playerModes',
          },
          {
            displayType: 'string',
            value: values?.platforms ? values?.platforms.join(';') : null,
            traitType: 'platforms',
          },
          {
            displayType: 'string',
            value: gameThumbnailSrc() ?? null,
            traitType: 'thumbnail',
          },
          {
            displayType: 'string',
            value: mediasSrc() ? mediasSrc().join(';') : null,
            traitType: 'medias',
          },
          {
            displayType: 'string',
            value: values.videoTrailerUrl ?? null,
            traitType: 'videoTrailerUrl',
          },
          {
            displayType: 'string',
            value: values.website ?? null,
            traitType: 'website',
          },
          {
            displayType: 'string',
            value: values.itchUrl ?? null,
            traitType: 'itchUrl',
          },
          {
            displayType: 'string',
            value: values.steamUrl ?? null,
            traitType: 'steamUrl',
          },
          {
            displayType: 'string',
            value: values.googlePlayUrl ?? null,
            traitType: 'googlePlayUrl',
          },
          {
            displayType: 'string',
            value: values.appleAppStoreUrl ?? null,
            traitType: 'appleAppStoreUrl',
          },

          {
            displayType: 'string',
            value: gameBannerSrc() ?? null,
            traitType: 'banner',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsCpu ?? null,
            traitType: 'minimumSystemRequirementsCpu',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsGpu ?? null,
            traitType: 'minimumSystemRequirementsGpu',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsOs ?? null,
            traitType: 'minimumSystemRequirementsOs',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsRam ?? null,
            traitType: 'minimumSystemRequirementsRam',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsStorage ?? null,
            traitType: 'minimumSystemRequirementsStorage',
          },
          {
            displayType: 'string',
            value: values.minimumSystemRequirementsAdditionalNotes ?? null,
            traitType: 'minimumSystemRequirementsAdditionalNotes',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsCpu ?? null,
            traitType: 'recommendedSystemRequirementsCpu',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsGpu ?? null,
            traitType: 'recommendedSystemRequirementsGpu',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsOs ?? null,
            traitType: 'recommendedSystemRequirementsOs',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsRam ?? null,
            traitType: 'recommendedSystemRequirementsRam',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsStorage ?? null,
            traitType: 'recommendedSystemRequirementsStorage',
          },
          {
            displayType: 'string',
            value: values.recommendedSystemRequirementsAdditionalNotes ?? null,
            traitType: 'recommendedSystemRequirementsAdditionalNotes',
          },
        ],
        version: '1.0.0',
        metadata_id: uuid,
      }

      const gameDataJSON = new File(
        [JSON.stringify(gameMetadata)],
        `gashapon-game-${uuid}-${stateFetchDefaultProfile.data.id}.json`,
        { type: 'application/json' },
      )
      const metadataUrl = await uploadGameData(gameDataJSON)
      const dataKey = uuid
      const skylink = metadataUrl.skylink

      // set a registry entry to point at 'skylink'
      await setDataLink(dataKey, skylink)

      // get the resolver skylink which references the registry entry
      const resolverSkylink = await getEntryLink(stateFetchDefaultProfile.data.id, dataKey)

      if (options.initialData) {
        stateIndexGameData.setError(null, false)
        stateIndexGameData.setIsLoading(false)
        stateIndexGameData.setIsSuccess(true)
        return
      }

      // After all files are uploaded
      const newGameRequest = {
        profileId: stateFetchDefaultProfile.data.id,
        contentURI: `${PORTAL}/${resolverSkylink.replace('sia://', '')}`,
        collectModule: {
          freeCollectModule: {
            followerOnly: false,
          }, // Collecting this = adding to wishlist
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      }
      const result = await createPublicationTypedData(newGameRequest)
      if (result?.data) {
        const typedData = result.data.createPostTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })
        const { v, r, s } = splitSignature(signature)
        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'postWithSig',
          args: {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          },
        })
        setCanStartCountdown(true)
        await pollUntilIndexed(tx.hash)
        setShowWaitMessage(false)
        stateIndexGameData.setIsSuccess(true)
        stateIndexGameData.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `Your game was created successfully!`,
        })
      } else {
        stateIndexGameData.setError(result.error.message, true)
        stateIndexGameData.setIsLoading(false)
        stateIndexGameData.setIsSuccess(false)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your game couldn't be created: ${result.error.message}`,
        })
      }
    } catch (e) {
      console.error(e)
      stateIndexGameData.setError(e?.message ?? e, true)
      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and we couldn't create your game: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

  createEffect(() => {
    if (!apiDialogModalTrackProgress().isOpen) {
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setIsSuccess(false)
      stateUploadNewGameData.setError(null, false)

      stateUploadGameBanner.setIsSuccess(false)
      stateUploadGameBanner.setIsLoading(false)
      stateUploadGameBanner.setError(null, false)

      stateUploadGameThumbnail.setIsSuccess(false)
      stateUploadGameThumbnail.setIsLoading(false)
      stateUploadGameThumbnail.setError(null, false)

      stateUploadGameMedias.setIsSuccess(false)
      stateUploadGameMedias.setIsLoading(false)
      stateUploadGameMedias.setError(null, false)

      stateIndexGameData.setIsLoading(false)
      stateIndexGameData.setIsSuccess(false)
      stateIndexGameData.setError(null, false)
    }
  })

  return {
    storeForm,
    showWaitMessage,
    stateUploadNewGameData,

    gameThumbnailSrc,
    onInputGameThumbnailChange,
    stateUploadGameThumbnail,
    removeThumbnail,
    fileGameThumbnail,

    gameBannerSrc,
    onInputGameBannerChange,
    stateUploadGameBanner,
    removeBanner,
    fileGameBanner,

    mediasSrc,
    onInputMediasChange,
    stateUploadGameMedias,
    removeMedia,
    filesMedias,

    stateIndexGameData,

    apiDialogModalTrackProgress,
  }
}

export default useIndexGameData
