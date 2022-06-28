import { createClient, chain, configureChains } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'

const defaultChains = [chain.polygon, chain.polygonMumbai]
const { provider } = configureChains(defaultChains, [publicProvider()])

export const client = createClient({
  provider,
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: defaultChains,
    }),
  ],
})

export default client
