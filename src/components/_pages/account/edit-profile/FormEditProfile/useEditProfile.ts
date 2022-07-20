import { string, object, instanceof as zodValidationInstanceOf } from 'zod'
import { validator } from '@felte/validator-zod'
import { createForm } from '@felte/solid'
import { createAsyncStore } from '@hooks/useAsync'
import abiLensPeriphery from '@abis/lens-periphery'
import abiLensHubProxy from '@abis/lens-hub-proxy'
import useToast from '@hooks/useToast'
import { pollUntilIndexed } from '@graphql/transactions/is-indexed'
import { updateProfileMetadata } from '@graphql/profile/update-profile'
import useIndexingTxWaitMessage from '@hooks/useIndexingTxWaitMessage'
import useSkynet from '@hooks/useSkynet'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import omit from '@helpers/omit'
import { signTypedData, writeContract } from '@wagmi/core'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY, CONTRACT_LENS_PERIPHERY } from '@config/contracts'
import { v4 as uuidv4 } from 'uuid'
import { createSignal } from 'solid-js'
import updateProfilePictureMetadata from '@graphql/profile/update-profile-picture'

const useStoreUploadProfilePicture = createAsyncStore()
const useStoreUploadProfileBanner = createAsyncStore()

const useStoreEditProfile = createAsyncStore()
const schema = object({
  name: string().trim().max(30).or(string().trim().max(0)),
  location: string().trim().max(30).or(string().trim().max(0)),
  bio: string().trim().max(200).or(string().trim().max(0)),
  website: string().url().max(200).or(string().trim().max(0)),
  itch: string().trim().min(2).max(25).or(string().trim().max(0)),
  twitter: string().trim().min(1).max(15).or(string().trim().max(0)),
  twitch: string().trim().min(4).max(25).or(string().trim().max(0)),
  'profile-banner': zodValidationInstanceOf(File).optional(),
  'profile-picture': zodValidationInstanceOf(File).optional(),
})

export function useEditProfile() {
  //@ts-ignore
  const { uploadData } = useSkynet()
  const toast = useToast()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const stateEditProfile = useStoreEditProfile()
  const stateUploadProfilePicture = useStoreUploadProfilePicture()
  const stateUploadProfileBanner = useStoreUploadProfileBanner()

  const { showWaitMessage, setCanStartCountdown } = useIndexingTxWaitMessage()
  // Profile picture
  const [profilePictureSrc, setProfilePictureSrc] = createSignal(
    stateFetchDefaultProfile.data?.picture?.original?.url ?? null,
  )
  const [fileProfilePicture, setFileProfilePicture] = createSignal()
  // Profile banner
  const [profileBannerSrc, setProfileBannerSrc] = createSignal(
    stateFetchDefaultProfile.data?.coverPicture?.original?.url ?? null,
  )
  const [fileProfileBanner, setFileProfileBanner] = createSignal()

  const storeForm = createForm({
    initialValues: {
      name: stateFetchDefaultProfile.data.name ?? '',
      bio: stateFetchDefaultProfile.data.bio ?? '',
      location: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'location')[0]?.value,
      website: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'website')[0]?.value,
      itch: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'itch')[0]?.value,
      twitter: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'twitter')[0]?.value,
      twitch: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'twitch')[0]?.value,
      layerColor: stateFetchDefaultProfile.data.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor')[0]
        ?.value,
      accentColor: stateFetchDefaultProfile.data.attributes.filter(
        (attr) => attr.key === 'gashaponProfileAccentColor',
      )[0]?.value,
    },
    onSubmit: async (values) => {
      await updateUserProfile(values)
    },
    extend: validator({ schema }),
  })

  function onInputProfileBannerChange(file) {
    const src = URL.createObjectURL(file)
    setProfileBannerSrc(src)
    setFileProfileBanner(file)
  }

  async function uploadProfileBanner() {
    stateUploadProfileBanner.setIsLoading(true)
    try {
      const url = await uploadData({ file: fileProfileBanner(), silentUpload: true })
      setProfileBannerSrc(url)
      stateUploadProfileBanner.setIsSuccess(true)
      stateUploadProfileBanner.setIsLoading(false)
      stateUploadProfileBanner.setError(null, false)
    } catch (e) {
      console.error(e)
      stateEditProfile.setIsLoading(false)
      stateEditProfile.setIsSuccess(false)
      stateEditProfile.setError(e?.message ?? e, true)
      stateUploadProfileBanner.setIsSuccess(false)
      stateUploadProfileBanner.setIsLoading(false)
      stateUploadProfileBanner.setError(e?.message ?? e, true)
    }
  }

  function onInputProfilePictureChange(file) {
    const src = URL.createObjectURL(file)
    setProfilePictureSrc(src)
    setFileProfilePicture(file)
  }

  async function updateProfilePicture() {
    stateUploadProfilePicture.setIsLoading(true)
    try {
      const profileId = stateFetchDefaultProfile.data.id
      const url = await uploadData({ file: fileProfilePicture(), silentUpload: true })
      const setProfileImageUriRequest = {
        profileId,
        url,
      }

      const result = await updateProfilePictureMetadata(setProfileImageUriRequest)
      if (result?.data) {
        const typedData = result.data.createSetProfileImageURITypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })
        const { v, r, s } = splitSignature(signature)
        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'setProfileImageURIWithSig',
          args: {
            profileId: typedData.value.profileId,
            imageURI: typedData.value.imageURI,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          },
        })
        setProfilePictureSrc(url)
        stateUploadProfilePicture.setIsSuccess(true)
        stateUploadProfilePicture.setIsLoading(false)
        stateUploadProfilePicture.setError(null, false)
        return tx.hash
      }
    } catch (e) {
      console.error(e)
      stateEditProfile.setIsLoading(false)
      stateEditProfile.setIsSuccess(false)
      stateEditProfile.setError(e?.message ?? e, true)
      stateUploadProfilePicture.setIsSuccess(false)
      stateUploadProfilePicture.setIsLoading(false)
      stateUploadProfilePicture.setError(e?.message ?? e, true)
    }
  }

  async function updateUserProfile(data) {
    stateEditProfile.setIsLoading(true)
    stateEditProfile.setError(null, false)
    const profileId = stateFetchDefaultProfile.data.id
    try {
      // If user changed profile picture
      if (
        profilePictureSrc() &&
        profilePictureSrc() !== null &&
        profilePictureSrc() !== stateFetchDefaultProfile.data?.picture?.original?.url
      ) {
        // Upload it to skynet and update it
        await updateProfilePicture()
      }
      // If user changed profile banner
      if (
        profileBannerSrc() &&
        profileBannerSrc() !== null &&
        profileBannerSrc() !== stateFetchDefaultProfile.data?.coverPicture?.original?.url
      ) {
        // Upload it to skynet
        await uploadProfileBanner()
      }

      const profile = {
        name: data?.name ?? null,
        bio: data?.bio ?? null,
        cover_picture: profileBannerSrc(),
        attributes: [
          ...stateFetchDefaultProfile.data.attributes,
          {
            traitType: 'string',
            value: data?.location ?? null,
            key: 'location',
          },
          {
            traitType: 'string',
            value: data?.website ?? null,
            key: 'website',
          },
          {
            traitType: 'string',
            value: data?.itch ?? null,
            key: 'itch',
          },
          {
            traitType: 'string',
            value: data?.twitter ?? null,
            key: 'twitter',
          },
          {
            traitType: 'string',
            value: data?.twitch ?? null,
            key: 'twitch',
          },
          {
            traitType: 'string',
            value: data?.layerColor ?? null,
            key: 'gashaponProfileLayerColor',
          },
          {
            traitType: 'string',
            value: data?.accentColor ?? null,
            key: 'gashaponProfileAccentColor',
          },
        ],
        version: '1.0.0',
        metadata_id: uuidv4(),
      }
      const profileJsonFile = new File(
        [JSON.stringify(profile)],
        `gashapon-profile-${profileId}-${profile.metadata_id}.json`,
        { type: 'application/json' },
      )
      const metadataUrl = await uploadData({
        file: profileJsonFile,
        successMessage: 'Profile data uploaded successfully!',
        errorMessage: "Something went wrong and your profile data couldn't be uploaded to Skynet.",
      })

      const updateProfileMetadataRequest = {
        profileId,
        metadata: metadataUrl,
      }
      //@ts-ignore
      const result = await updateProfileMetadata(updateProfileMetadataRequest)

      if (result?.data) {
        const typedData = result.data.createSetProfileMetadataTypedData.typedData
        const signature = await signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const tx = await writeContract({
          addressOrName: CONTRACT_LENS_PERIPHERY,
          contractInterface: abiLensPeriphery,
          functionName: 'setProfileMetadataURIWithSig',
          args: {
            profileId: typedData.value.profileId,
            metadata: metadataUrl,
            ...profile,

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
        stateEditProfile.setIsSuccess(true)
        stateEditProfile.setData(result.data)
        //@ts-ignore

        toast().create({
          type: 'success',
          title: `Your profile was updated successfully!`,
        })
      } else {
        stateEditProfile.setError(result.error.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `Something went wrong and your profile data couldn't be updated: ${result.error.message}`,
        })
      }
      stateEditProfile.setIsLoading(false)
    } catch (e) {
      console.error(e)
      stateEditProfile.setError(e?.message ?? e, true)
      stateEditProfile.setIsLoading(false)
      stateEditProfile.setIsSuccess(false)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `Something went wrong and your profile data couldn't be updated: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }
  return {
    storeForm,
    stateEditProfile,
    showWaitMessage,
    onInputProfilePictureChange,
    onInputProfileBannerChange,
    profilePictureSrc,
    profileBannerSrc,
  }
}

export default useEditProfile
