import { createSignal, createEffect } from 'solid-js'
import { watchNetwork, getNetwork, connect } from '@wagmi/core'
import { client } from '@config/wagmi'
import useAccount from '../useAccount'
import useWagmiStore from '../useWagmiStore'

export function useNetwork() {
  const wagmiState = useWagmiStore()
  const { accountData } = useAccount()
  const [networkData, setNetworkData] = createSignal(getNetwork())
  createEffect(async () => {
    setNetworkData(getNetwork())

    if (!accountData()?.connector) {
      const idConnector = JSON.parse(client.storage['wagmi.wallet'])
      // @ts-expect-error
      const connector = wagmiState.connectors.filter((c) => c.id === idConnector)[0]
      await connect({ connector })
      setNetworkData(getNetwork())
    }

    const unwatch = watchNetwork(setNetworkData)
    return () => {
      unwatch()
    }
  })

  return {
    networkData,
  }
}

export default useNetwork
