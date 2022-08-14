import { useParams, useRouteData } from 'solid-app-router'
import { UserProfileLayout as LayoutUserProfile } from '@layouts/UserProfile'
import { Title } from 'solid-meta'
import { Match, Suspense, Switch } from 'solid-js'

export default function Page() {
  const params = useParams()
  const profile = useRouteData()
  return (
    <Suspense fallback={<>Loading...</>}>
      <Switch>
        {/* @ts-ignore */}
        <Match when={profile()?.error || !profile()?.data}>
          <Title>Profile not found - Gashapon</Title>
          <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
            <h1 class="mb-4 font-bold text-2xl">This profile is a MissingNo !</h1>
            <p class="text-ex font-semibold text-neutral-400">
              The profile associated to <span class="font-bold text-brand-pink">@{params.idUser}</span> doesn't exist or
              was deleted.
            </p>
          </div>
        </Match>
        {/* @ts-ignore */}
        <Match when={profile()?.data}>
          {/* @ts-ignore */}
          <LayoutUserProfile profile={profile()?.data?.profile}>
            <Title>
              {/* @ts-ignore */}
              {profile()?.data?.profile?.name
                ? //@ts-ignore
                  `${profile()?.data?.profile?.name} (@${params.idUser})`
                : `@${params.idUser}`}{' '}
              - Gashapon
            </Title>
            <section
              style={{
                //@ts-ignore
                '--layer': profile()?.data?.profile?.attributes.filter(
                  (attr) => attr.key === 'gashaponProfileLayerColor',
                )[0]?.value,
              }}
              classList={{
                'bg-user-custom-color':
                  //@ts-ignore
                  profile()?.data?.profile?.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor')
                    .length >= 1,
                'bg-neutral-900':
                  //@ts-ignore
                  profile()?.data?.profile?.attributes.filter((attr) => attr.key === 'gashaponProfileLayerColor')
                    .length === 0,
              }}
              class="flex-grow flex flex-col rounded-lg p-2 mt-3 "
            >
              <div class="px-8 mt-1"></div>
            </section>
          </LayoutUserProfile>
        </Match>
      </Switch>
    </Suspense>
  )
}
