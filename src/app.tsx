import type { Component } from 'solid-js'
import { MetaProvider } from 'solid-meta'
import { BasicLayout } from '@layouts/Base'
import { ProviderUserVerification } from '@hooks/useVerifyUser'
import { ProviderDefaultProfile } from '@hooks/useCurrentUserDefaultProfile'
import { ProviderToast } from '@hooks/useToast'
import { ProviderSkynet } from '@hooks/useSkynet'
import { Router } from './routes'
import { ProviderWagmi } from '@hooks/useWagmiStore'

const App: Component = () => {
  return (
    <MetaProvider>
      <ProviderToast>
        <ProviderWagmi>
          <ProviderUserVerification>
            <ProviderDefaultProfile>
              <ProviderSkynet>
                <BasicLayout>
                  <Router />
                </BasicLayout>
              </ProviderSkynet>
            </ProviderDefaultProfile>
          </ProviderUserVerification>
        </ProviderWagmi>
      </ProviderToast>
    </MetaProvider>
  )
}

export default App
