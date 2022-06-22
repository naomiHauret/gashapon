import { createContext, createEffect, useContext } from 'solid-js'
import create from 'solid-zustand'
import { getDefaultProfile } from '@graphql/get-default-profile'
import useAccount from '../useAccount'

interface FetchDefaultProfileState {
  error: null | string
  success: boolean,
  loading: boolean,
  data: any,
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setSuccess: (success: boolean) => void
  setData: (data: any) => void
}

const useFetchDefaultProfileStore = create<FetchDefaultProfileState>((set) => ({
    error: null,
    loading: false,
    success: false,
    data: null,
    setSuccess: (value) => set((state) => ({ success: value })),
    setData: (value) => set((state) => ({ data: value })),
    setLoading: (value) => set((state) => ({ loading: value })),
    setError: (error: string | null) => set((state) => ({  error })),
}))
  
const ContextDefaultProfile = createContext();

export function ProviderDefaultProfile(props) {
  const stateFetchDefaultProfile = useFetchDefaultProfileStore()
  const { accountData } = useAccount()

  async function fetchDefaultProfile() {
    stateFetchDefaultProfile.setLoading(true)
    stateFetchDefaultProfile.setError(null)

   try {
    const address = accountData().address
    const profile = await getDefaultProfile(address);
    stateFetchDefaultProfile.setError(null)
    stateFetchDefaultProfile.setLoading(false)
    if(!profile.error || profile.error === null) {
      stateFetchDefaultProfile.setData(profile.data?.defaultProfile ?? null)
      stateFetchDefaultProfile.setSuccess(true)
    } else {
      stateFetchDefaultProfile.setSuccess(false)
      stateFetchDefaultProfile.setError(profile.error)

    }
   } catch(e) {
    stateFetchDefaultProfile.setSuccess(false)
    stateFetchDefaultProfile.setLoading(false)
    stateFetchDefaultProfile.setError(e)
   }
  }


  createEffect(async () => {
    if (accountData().address) {
      await fetchDefaultProfile()
    } else {
      stateFetchDefaultProfile.setLoading(false)
    }
  })

  const store= {
    stateFetchDefaultProfile,
    fetchDefaultProfile
  }
  

  return (
    <ContextDefaultProfile.Provider value={store}>
      {props.children}
    </ContextDefaultProfile.Provider>
  );
}

export function useDefaultProfile() { return useContext(ContextDefaultProfile); }

export default useDefaultProfile