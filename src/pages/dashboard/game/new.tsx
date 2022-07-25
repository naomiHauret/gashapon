import { IconLock } from '@components/Icons'
import FormIndexGameData from '@components/_pages/dashboard/game/FormIndexGameData'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Show } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const { stateFetchDefaultProfile } = useDefaultProfile()

  return (
    <>
      <Title>Create a new game - Gashapon</Title>
      <Show when={!stateFetchDefaultProfile?.data?.id}>
        <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
          <h2 class="text-2xl text-white font-bold flex items-center">
            <IconLock class="mie-1ex" /> Access restricted
          </h2>
          <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
            Please sign-in and verify your account to access this page.
          </p>
        </div>
      </Show>
      <Show when={stateFetchDefaultProfile?.data?.id}>
        <main class="mx-auto container animate-appear">
          <h1 class="font-bold mb-3 text-xl">Create new game page</h1>

          <p class="font-semibold text-md mb-3">Let's create and index your game in Gashapon first.</p>
          <p class="text-neutral-500 italic mb-6">You'll set up your sale offers and download files afterwards.</p>
          <FormIndexGameData />
        </main>
      </Show>
    </>
  )
}
