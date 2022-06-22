import type { Component } from 'solid-js'
import { MetaProvider } from 'solid-meta'
import { useRoutes } from 'solid-app-router'
import { routes } from './routes'
import { BasicLayout } from '@layouts/Base'
import { ProviderUserVerification } from '@hooks/useVerifyUser'
import { ProviderDefaultProfile } from '@hooks/useCurrentUserDefaultProfile'
const App: Component = () => {
  const Route = useRoutes(routes)

  return (
    <MetaProvider>
      <ProviderUserVerification>
        <ProviderDefaultProfile>
          <BasicLayout>
            <Route />
          </BasicLayout>
        </ProviderDefaultProfile>
      </ProviderUserVerification>
    </MetaProvider>
  )
}

export default App
