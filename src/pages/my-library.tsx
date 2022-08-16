import { Title } from 'solid-meta'
import { Show } from 'solid-js'
import { IconLock } from '@components/Icons'
import useVerifyUser from '@hooks/useVerifyUser'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { ListGames } from '@components/_pages/my-library/ListGames'
export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()

  return (
    <>
      <Title>My game library - Gashapon</Title>
      <main class="mx-auto container">
        <Show
          when={
            !stateFetchDefaultProfile?.data?.id || !walletVerifiedState?.verified || !walletVerifiedState?.connected
          }
        >
          <div class="animate-appear flex flex-col mt-6  items-center justify-center text-xl">
            <h2 class="text-2xl text-white font-bold flex items-center">
              <IconLock class="mie-1ex" /> Access restricted
            </h2>
            <p class="pt-2 text-center text-neutral-400 font-semibold max-w-screen-xs">
              Please sign-in and verify your account to access this page.
            </p>
          </div>
        </Show>
        <Show
          when={stateFetchDefaultProfile?.data?.id && walletVerifiedState?.verified && walletVerifiedState?.connected}
        >
          <ListGames />
        </Show>
      </main>
    </>
  )
}
