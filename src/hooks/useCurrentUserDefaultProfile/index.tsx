import { createContext, createEffect, useContext } from 'solid-js'
import { getDefaultProfile } from '@graphql/profile/get-default-profile'
import { createAsyncStore } from '@hooks/useAsync'
import { useAccount } from '@hooks/useAccount'
import { getProfiles } from '@graphql/profile/get-profiles'
import useVerifyUser from '@hooks/useVerifyUser'

const useStoreFetchDefaultProfile = createAsyncStore()
const useStoreFetchOwnedProfile = createAsyncStore()

const ContextDefaultProfile = createContext()

export function ProviderDefaultProfile(props) {
  const stateFetchOwnedProfiles = useStoreFetchOwnedProfile()
  const stateFetchDefaultProfile = useStoreFetchDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  const { accountData } = useAccount()

  async function fetchProfiles() {
    stateFetchOwnedProfiles.setIsLoading(true)

    try {
      const address = accountData().address
      const profiles = await getProfiles({
        ownedBy: [address],
      })
      if (!profiles.error || profiles.error === null) {
        const data = profiles.data.profiles.items
        stateFetchOwnedProfiles.setData(data)
        stateFetchOwnedProfiles.setIsSuccess(true)
        stateFetchOwnedProfiles.setError(null, false)
      } else {
        stateFetchOwnedProfiles.setIsSuccess(false)
        stateFetchOwnedProfiles.setError(profiles.error.message, true)
      }
      stateFetchOwnedProfiles.setIsLoading(false)
      stateFetchOwnedProfiles.setDidFetch(true)
    } catch (e) {
      stateFetchOwnedProfiles.setIsSuccess(false)
      stateFetchOwnedProfiles.setIsLoading(false)
      stateFetchOwnedProfiles.setError(e, true)
      stateFetchOwnedProfiles.setDidFetch(true)
    }
  }

  async function fetchDefaultProfile() {
    stateFetchDefaultProfile.setIsLoading(true)

    try {
      const address = accountData().address
      const profile = await getDefaultProfile(address)
      if (!profile.error || profile.error === null) {
        stateFetchDefaultProfile.setData(profile.data?.defaultProfile ?? null)
        stateFetchDefaultProfile.setIsSuccess(true)
        stateFetchDefaultProfile.setError(null, false)
      } else {
        stateFetchDefaultProfile.setIsSuccess(false)
        stateFetchDefaultProfile.setError(profile.error.message, true)
      }
      stateFetchDefaultProfile.setIsLoading(false)
      stateFetchDefaultProfile.setDidFetch(true)
      stateFetchDefaultProfile.setRefresh(false)
    } catch (e) {
      stateFetchDefaultProfile.setIsSuccess(false)
      stateFetchDefaultProfile.setIsLoading(false)
      stateFetchDefaultProfile.setError(e, true)
      stateFetchDefaultProfile.setDidFetch(true)
      stateFetchDefaultProfile.setRefresh(false)
    }
  }

  const store = {
    stateFetchOwnedProfiles,
    stateFetchDefaultProfile,
    fetchDefaultProfile,
    fetchProfiles,
  }

  createEffect(() => {
    if (accountData()?.address && walletVerifiedState?.verified && walletVerifiedState?.connected) {
      fetchProfiles()
      fetchDefaultProfile()
    } else {
      stateFetchOwnedProfiles.setData(null)
      stateFetchDefaultProfile.setData(null)
    }
  })
  return <ContextDefaultProfile.Provider value={store}>{props.children}</ContextDefaultProfile.Provider>
}

export function useDefaultProfile() {
  return useContext(ContextDefaultProfile)
}

export default useDefaultProfile
