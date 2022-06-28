import type { Component } from 'solid-js'
import { MetaProvider } from 'solid-meta'
import { BasicLayout } from '@layouts/Base'
import { ProviderUserVerification } from '@hooks/useVerifyUser'
import { ProviderDefaultProfile } from '@hooks/useCurrentUserDefaultProfile'
import { ProviderToast } from '@hooks/useToast'
import { Router } from './routes'

const App: Component = () => {
  return (
    <MetaProvider>
      <ProviderToast>
        <ProviderUserVerification>
          <ProviderDefaultProfile>
            <BasicLayout>
              <Router />
            </BasicLayout>
          </ProviderDefaultProfile>
        </ProviderUserVerification>
      </ProviderToast>
    </MetaProvider>
  )
}

export default App
