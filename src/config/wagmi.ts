import { createClient, chain } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

const defaultChains = [chain.polygon, chain.polygonMumbai]
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: defaultChains,
    }),
  ],
})

export default client
