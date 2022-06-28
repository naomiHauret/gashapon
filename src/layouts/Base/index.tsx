import { createEffect, Show, Switch, Match } from 'solid-js'
import { Link, useIsRouting, useLocation, useNavigate } from 'solid-app-router'
import {
  ROUTE_CREATE_COMMUNITY,
  ROUTE_CREATE_COMMUNITY_POST,
  ROUTE_CREATE_GAME,
  ROUTE_CREATE_GAME_UPDATE,
  ROUTE_CREATE_POST,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
} from '@config/routes'
import PopoverConnectWallet from '@components/PopoverConnectWallet'
import styles from './Navigation/styles.module.css'
import useVerifyUser from '@hooks/useVerifyUser'
import { Portal } from 'solid-js/web'
import DialogModal from '@components/DialogModal'
import { IconCircleSolidCheck, IconSpinner } from '@components/Icons'
import Button from '@components/Button'
import Navigation from './Navigation'
import useAccount from '@hooks/useAccount'
import useCurrentUserDefaultProfile from '@hooks/useCurrentUserDefaultProfile'

export const BasicLayout = (props) => {
  //@ts-ignore
  const { accountData } = useAccount()
  //@ts-ignore
  const { walletVerifiedState, dialogApi, verify } = useVerifyUser()
  //@ts-ignore
  const { stateFetchOwnedProfiles, stateFetchDefaultProfile, fetchProfiles, fetchDefaultProfile } =
    useCurrentUserDefaultProfile()
  const isRouting = useIsRouting()
  const location = useLocation()
  const navigate = useNavigate()

  createEffect(() => {
    if (
      location.pathname === ROUTE_SIGN_IN &&
      !isRouting() &&
      walletVerifiedState.connected &&
      walletVerifiedState.verified
    ) {
      navigate('/', { replace: true })
    }
  })

  createEffect(() => {
    if (walletVerifiedState.connected && walletVerifiedState.verified) dialogApi().close()
  })

  createEffect(async () => {
    if (accountData().address) {
      await fetchProfiles()
      await fetchDefaultProfile()
    } else {
      stateFetchOwnedProfiles.setIsLoading(false)
      stateFetchDefaultProfile.setIsLoading(false)
    }
  })

  return (
    <>
      <div class="flex mx-auto container relative z-10">
        <div class="xs:hidden"></div>
        <div
          class={`${styles['navlink']} p-1 flex items-center justify-center aspect-square translate-y-[calc(75%-6px)] rounded-full mie-8 xs:mie-10`}
        >
          <Link href="/">
            <img src="/logo-icon.png" alt="" width="39px" height="30px" />
            <span class="sr-only">Home</span>
          </Link>
        </div>
        <Navigation />
        <Show when={location.pathname !== ROUTE_SIGN_IN}>
          <div class="mis-auto translate-y-3/4">
            <PopoverConnectWallet />
          </div>
        </Show>
      </div>

      <div class="w-full bg-brand-indigo h-1" />
      <div class="w-full bg-brand-yellow h-1 my-0.5" />
      <div class="w-full bg-brand-pink h-1.5" />
      <div class="flex-grow flex flex-col pt-10 sm:pt-20">
        <Show when={!isRouting()}>{props.children}</Show>
      </div>
      {dialogApi().isOpen && (
        <Portal>
          <DialogModal
            api={dialogApi}
            title="Connect your Ethereum wallet"
            description="Connect your Ethereum wallet and verify your signature to start using Gashapon."
          >
            <div
              classList={{
                'text-white text-opacity-50': !walletVerifiedState.connected,
              }}
              class="mb-4"
            >
              <div class="flex items-center">
                <Switch>
                  <Match when={!walletVerifiedState.connected && walletVerifiedState.loading}>
                    <IconSpinner class="mie-1ex text-md animate-spin" />
                  </Match>
                  <Match when={walletVerifiedState.connected}>
                    <IconCircleSolidCheck class="mie-1ex text-md" />
                  </Match>
                </Switch>
                <span class="text-ex font-bold">Step 1/2 : Connect</span>
              </div>
              <p class="mt-1">Please confirm the connection in your wallet.</p>
            </div>
            <div
              classList={{
                'text-white text-opacity-50': !walletVerifiedState.connected,
              }}
            >
              <div class="flex items-center">
                <Switch>
                  <Match
                    when={walletVerifiedState.connected && !walletVerifiedState.verified && walletVerifiedState.loading}
                  >
                    <IconSpinner class="text-md mie-1ex animate-spin" />
                  </Match>
                  <Match when={walletVerifiedState.verified}>
                    <IconCircleSolidCheck class="text-md mie-1ex" />
                  </Match>
                </Switch>
                <span class="text-ex font-bold">Step 2/2 : Verify</span>
              </div>
              <p class="mt-1">
                Please sign the message in your wallet to verify that you’re the owner of this address.
              </p>
            </div>
            <Show when={walletVerifiedState.connected && !walletVerifiedState.verified}>
              <Show when={walletVerifiedState.error !== null}>
                <p class="mt-5 text-rose-400 font-bold">Something went wrong, please try verifying again.</p>
              </Show>
              <div class="flex">
                <Button
                  isLoading={walletVerifiedState.loading}
                  onClick={async () => await verify()}
                  class="mx-auto mt-5"
                >
                  <Switch>
                    <Match when={walletVerifiedState.error === null}>Verify my wallet</Match>
                    <Match when={walletVerifiedState.error !== null}>Try again</Match>
                  </Switch>
                </Button>
              </div>
            </Show>
          </DialogModal>
        </Portal>
      )}
    </>
  )
}

export default BasicLayout
