import { useParams, useRouteData } from 'solid-app-router'
import { UserProfileLayout as LayoutUserProfile } from '@layouts/UserProfile'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  const profile = useRouteData()

  return (
    <LayoutUserProfile profile={profile}>
      <Title>
        {profile?.latest?.name ? `${profile?.latest?.name} (@${params.idUser})` : `@${params.idUser}`} - Gashapon
      </Title>
      <section
        style={{
          '--layer': profile?.latest?.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor')[0]?.value,
        }}
        classList={{
          'bg-user-custom-color':
            profile?.latest?.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor').length >= 1,
          'bg-neutral-900':
            profile?.latest?.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor').length === 0,
        }}
        class="flex-grow flex flex-col rounded-lg p-2 mt-3 "
      >
        <div class="px-8 mt-1"></div>
      </section>
    </LayoutUserProfile>
  )
}
