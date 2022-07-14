import create from 'solid-zustand'

interface AsyncState {
  data: any
  didFetch: boolean
  isSuccess: boolean
  isError: boolean
  isLoading: boolean
  error: null | string
  setDidFetch: (didFetch: boolean) => void
  setIsSuccess: (isSuccess: boolean) => void
  setError: (err: string | null, isErr: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setData: (data: any) => void
}

export const createAsyncStore = () =>
  create<AsyncState>((set) => ({
    data: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    error: null,
    didFetch: false,
    setDidFetch: (value) => set(() => ({ didFetch: value })),
    setIsSuccess: (value) => set(() => ({ isSuccess: value })),
    setError: (err, isErr) => set(() => ({ error: err, isError: isErr })),
    setIsLoading: (value) => set(() => ({ isLoading: value })),
    setData: (value) => set(() => ({ data: value })),
  }))
