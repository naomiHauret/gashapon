import { IconLock } from '@components/Icons'
import FormEditProfile from '@components/_pages/account/edit-profile/FormEditProfile'
import { Show } from 'solid-js'
import { Title } from 'solid-meta'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useVerifyUser from '@hooks/useVerifyUser'

export default function Page() {
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()

  return (
    <>
      <Title>Edit my profile - Gashapon</Title>
      <Show
        when={!stateFetchDefaultProfile?.data?.id || !walletVerifiedState?.connected || !walletVerifiedState?.verified}
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
        when={stateFetchDefaultProfile?.data?.id && walletVerifiedState?.connected && walletVerifiedState?.verified}
      >
        <main>
          <FormEditProfile />
        </main>
      </Show>
    </>
  )
}
