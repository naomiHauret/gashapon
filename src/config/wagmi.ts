import { createClient, chain, configureChains } from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import { API_URL } from './lens'

const appChains = API_URL === 'https://api.lens.dev' ? [chain.polygon] : [chain.polygonMumbai]
const providers = [publicProvider()]
export const { chains, provider } = configureChains(appChains, providers)

export const client = createClient({
  provider,
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains: appChains,
    }),
  ],
})

export default client
