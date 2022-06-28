import { disconnect, connect, switchNetwork, chain } from '@wagmi/core'
import useVerifyUser from './../useVerifyUser'
import useWagmiStore from '../useWagmiStore'
import { COOKIE_ACCESS_TOKENS } from '@config/storage'
import { createEffect } from 'solid-js'
import useNetwork from '@hooks/useNetwork/index.'

export function useConnect() {
  const wagmiState = useWagmiStore()
  const { networkData } = useNetwork()
  const { walletVerifiedState, remove } = useVerifyUser()

  async function connectWallet(connector) {
    walletVerifiedState.setVerified(false)
    walletVerifiedState.setConnected(false)
    walletVerifiedState.setError(null)
    walletVerifiedState.setLoading(true)
    try {
      await disconnect()
      await connect({ connector })
      walletVerifiedState.setConnected(true)
    } catch (e) {
      walletVerifiedState.setConnected(false)
      walletVerifiedState.setLoading(false)
      walletVerifiedState.setError(e)
      console.error(e)
    }
  }

  async function disconnectWallet() {
    try {
      await disconnect()
      remove(COOKIE_ACCESS_TOKENS)
      walletVerifiedState.setVerified(false)
      walletVerifiedState.setConnected(false)
      walletVerifiedState.setLoading(false)
    } catch (e) {
      walletVerifiedState.setLoading(false)
      walletVerifiedState.setError(e)
      console.error(e)
    }
  }

  async function switchToSupportedNetwork() {
    try {
      await switchNetwork({ chainId: chain.polygonMumbai.id })
    } catch (e) {
      //@TODO: add toast error here
      console.error(e)
    }
  }

  createEffect(async () => {
    if (networkData()?.chain?.supported === false || !networkData()?.chain) {
      await disconnectWallet()
    }
  })
  return {
    connect: connectWallet,
    switchToSupportedNetwork,
    disconnect: disconnectWallet,
    //@ts-ignore
    connectors: wagmiState.connectors,
  }
}

export default useConnect
