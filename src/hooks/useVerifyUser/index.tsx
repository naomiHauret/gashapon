import { createContext, createEffect, createMemo, createUniqueId, useContext } from 'solid-js'
import { addMinutes } from 'date-fns'
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import * as dialog from '@zag-js/dialog'
import { createCookieStorage } from '@solid-primitives/storage'
import { signMessage } from '@wagmi/core'
import create from 'solid-zustand'
import generateChallenge from '@graphql/authentication/generate-challenge'
import authenticate from '@graphql/authentication/authenticate'
import { COOKIE_ACCESS_TOKENS } from '@config/storage'
import useAccount from '../useAccount'
import type { PropTypes } from '@zag-js/solid'
import useNetwork from '@hooks/useNetwork/index.'
import useToast from '@hooks/useToast'

interface WalletVerifiedState {
  error: null | string
  loading: boolean
  verified: boolean
  connected: boolean
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setVerified: (verified: boolean) => void
  setConnected: (connected: boolean) => void
}

const useVerifyWalletStore = create<WalletVerifiedState>((set) => ({
  error: null,
  loading: false,
  verified: false,
  connected: false,
  setConnected: (value) => set((state) => ({ connected: value })),
  setVerified: (value) => set((state) => ({ verified: value })),
  setLoading: (value) => set((state) => ({ loading: value })),
  setError: (error: string | null) => set((state) => ({ error })),
}))

const ContextUserVerification = createContext()

export function ProviderUserVerification(props) {
  const toast = useToast()
  const dialogId = createUniqueId()
  const [state, send] = useMachine(
    dialog.machine({
      closeOnOutsideClick: false,
      closeOnEsc: false,
    }),
  )
  const dialogRef = useSetup({ send, id: dialogId })
  const dialogApi = createMemo(() => dialog.connect<PropTypes>(state, send, normalizeProps))

  const [storage, setStorage, { remove }] = createCookieStorage()
  const { accountData } = useAccount()
  const { networkData } = useNetwork()

  const walletVerifiedState = useVerifyWalletStore()

  async function verify() {
    remove(COOKIE_ACCESS_TOKENS)
    walletVerifiedState.setLoading(true)
    walletVerifiedState.setError(null)

    try {
      const address = accountData().address
      const challengeResponse = await generateChallenge(address)

      // sign the text with the wallet
      const signature = await signMessage({ message: challengeResponse.data.challenge.text })

      const accessTokens = await authenticate(address, signature)
      setStorage(COOKIE_ACCESS_TOKENS, accessTokens.data.authenticate.accessToken, {
        expires: addMinutes(new Date(), 30),
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
      })
      walletVerifiedState.setError(null)
      walletVerifiedState.setLoading(false)
      walletVerifiedState.setVerified(true)
      walletVerifiedState.setConnected(true)
    } catch (e) {
      //@ts-ignore
      toast().create({
        type: 'error',
        title: e?.message ?? e,
      })
      console.error(e)
      walletVerifiedState.setVerified(false)
      walletVerifiedState.setLoading(false)
      walletVerifiedState.setError(e)
    }
  }

  createEffect(async () => {
    if (
      accountData().address &&
      networkData()?.chain?.unsupported === false &&
      storage[COOKIE_ACCESS_TOKENS] !== null
    ) {
      walletVerifiedState.setLoading(false)
      walletVerifiedState.setVerified(true)
      walletVerifiedState.setConnected(true)
    }
  })

  const store = {
    walletVerifiedState,
    storage,
    remove,
    dialogApi,
    dialogRef,
    verify,
  }

  return <ContextUserVerification.Provider value={store}>{props.children}</ContextUserVerification.Provider>
}

export function useVerifyUser() {
  return useContext(ContextUserVerification)
}

export default useVerifyUser
