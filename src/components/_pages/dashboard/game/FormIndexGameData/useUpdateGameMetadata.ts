import { string, object, instanceof as zodValidationInstanceOf, number } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine, useSetup } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
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
import { createPublicationTypedData } from '@graphql/publication/create'
import { LENS_PUBLICATIONS_APP_ID } from '@config/lens'

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
  thumbnail: zodValidationInstanceOf(File).optional(),
  videoTrailerUrl: string().url().or(string().max(0)),
  banner: zodValidationInstanceOf(File).optional(),
  medias: zodValidationInstanceOf(File).array().optional(),
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

export function useUpdaGameMetadata(options) {
  const [stateDialogModalTrackProgress, sendDialogModalTrackProgress] = useMachine(
    dialog.machine({
      role: 'alertdialog',
      closeOnOutsideClick: false,
      closeOnEsc: false,
      preventScroll: true,
    }),
  )

  const apiDialogModalTrackProgress = createMemo(() =>
    dialog.connect(stateDialogModalTrackProgress, sendDialogModalTrackProgress, normalizeProps),
  )
  const dialogModalTrackProgressRef = useSetup({ send: sendDialogModalTrackProgress, id: createUniqueId() })

  //@ts-ignore
  const { uploadData } = useSkynet()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const toast = useToast()
  const stateUploadGameThumbnail = useStoreUploadGameThumbnail()
  const stateUploadGameBanner = useStoreUploadGameBanner()
  const stateUploadGameMedias = useStoreUploadGameMedias()
  const stateUploadNewGameData = useStoreUploadNewGameData()
  const { showWaitMessage, setCanStartCountdown } = useIndexingTxWaitMessage()

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
      setGameThumbnailSrc(url)
      stateUploadGameThumbnail.setIsSuccess(true)
      stateUploadGameThumbnail.setIsLoading(false)
      stateUploadGameThumbnail.setError(null, false)
    } catch (e) {
      console.error(e)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setIsSuccess(false)
      stateUploadNewGameData.setError(e?.message ?? e, true)
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
      setGameBannerSrc(url)
      stateUploadGameBanner.setIsSuccess(true)
      stateUploadGameBanner.setIsLoading(false)
      stateUploadGameBanner.setError(null, false)
    } catch (e) {
      console.error(e)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setIsSuccess(false)
      stateUploadNewGameData.setError(e?.message ?? e, true)
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

  function removeMedia(index) {
    const newMediasArray = mediasSrc().filter((media, i) => index !== i)
    //@ts-ignore
    const newFilesArray = filesMedias().filter((file, i) => index !== i)
    setMediasSrc([...newMediasArray])
    setFilesMedias([...newFilesArray])
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
      const url = await uploadData({ file: filesMedias(), silentUpload: true })
      setMediasSrc(url)
      stateUploadGameMedias.setIsSuccess(true)
      stateUploadGameMedias.setIsLoading(false)
      stateUploadGameMedias.setError(null, false)
    } catch (e) {
      console.error(e)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setIsSuccess(false)
      stateUploadNewGameData.setError(e?.message ?? e, true)
      stateUploadGameMedias.setIsSuccess(false)
      stateUploadGameMedias.setIsLoading(false)
      stateUploadGameMedias.setError(e?.message ?? e, true)
    }
  }

  async function updateGameMetadata(values) {
    stateUploadNewGameData.setIsLoading(true)
    stateUploadNewGameData.setError(null, false)
    apiDialogModalTrackProgress().open()
    try {
      // If thumbnail changed
      if (gameThumbnailSrc() && gameThumbnailSrc() !== null) {
        // Upload it to skynet
        await uploadGameThumbnail()
      }
      // If game banner changed
      if (gameBannerSrc() && gameBannerSrc() !== null) {
        // Upload it to skynet
        await uploadGameBanner()
      }
      // If game medias changed
      if (mediasSrc() && mediasSrc() !== null) {
        // Upload it to skynet
        await uploadGameMedias()
      }
      const gameMetadata = {
        appId: LENS_PUBLICATIONS_APP_ID,
        description: `${values.title} - Digital Gashapon Game Caspule`,
        content: `${values.title}, a game distributed on Gashapon.`,
        name: `${values.title} - Game info`,
        image: gameThumbnailSrc(),
        imageMimeType: '',
        media: mediasSrc(),
        attributes: [
          {
            displayType: 'string',
            value: 'game-info',
            traitType: 'type',
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
            value: values?.genres ? values?.genres.toString() : null,
            traitType: 'genres',
          },
          {
            displayType: 'string',
            value: values?.tags ? values?.tags.toString() : null,
            traitType: 'tags',
          },
          {
            displayType: 'string',
            value: values?.playerModes ? values?.playerModes.toString() : null,
            traitType: 'playerModes',
          },
          {
            displayType: 'string',
            value: values?.platforms ? values?.platforms.toString() : null,
            traitType: 'platforms',
          },
          {
            displayType: 'string',
            value: gameThumbnailSrc() ?? null,
            traitType: 'thumbnail',
          },
          {
            displayType: 'string',
            value: mediasSrc() ?? null,
            traitType: 'thumbnail',
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
            value: mediasSrc() ?? null,
            traitType: 'medias',
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
        metadata_id: uuidv4(),
      }

      const gameDataJSON = new File(
        [JSON.stringify(gameMetadata)],
        `gashapon-game-${values.title.toLowerCase().replace(' ', '_')}-${gameMetadata.metadata_id}-${
          stateFetchDefaultProfile.data.id
        }.json`,
        { type: 'application/json' },
      )
      const metadataUrl = await uploadData({
        file: gameDataJSON,
        successMessage: 'Game data uploaded successfully!',
        errorMessage: "Something went wrong and your game data couldn't be uploaded to Skynet.",
      })

      // After all files upload
      const newGameRequest = {
        profileId: stateFetchDefaultProfile.data.id,
        contentURI: metadataUrl,
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
        stateUploadNewGameData.setIsSuccess(true)
        stateUploadNewGameData.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `Your game was created successfully!`,
        })
      } else {
        stateUploadNewGameData.setError(result.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your game couldn't be created: ${result.error.message}`,
        })
      }
    } catch (e) {
      console.error(e)
      stateUploadNewGameData.setError(e?.message ?? e, true)
      stateUploadNewGameData.setIsLoading(false)
      stateUploadNewGameData.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and we couldn't create your game: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

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

    apiDialogModalTrackProgress,
    dialogModalTrackProgressRef,
  }
}

export default useUpdaGameMetadata
