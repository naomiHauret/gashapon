import { createMemo, createEffect, createSignal, Match, Switch, createUniqueId, Show } from 'solid-js'
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine, useSetup } from '@zag-js/solid'
import ButtonGroupWalletOptions from '@components/ButtonGroupWalletOptions'
import useAccount from '@hooks/useAccount'
import useConnect from '@hooks/useConnect'
import button from '@components/Button//button'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import popoverStyles from './styles.module.css'
import useVerifyUser from '@hooks/useVerifyUser'
import useCurrentUserDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { Link } from 'solid-app-router'
import {
  ROUTE_CREATE_GAME,
  ROUTE_DASHBOARD,
  ROUTE_FEED,
  ROUTE_LIBRARY,
  ROUTE_ACCOUNT,
  ROUTE_EDIT_PROFILE,
} from '@config/routes'
import { IconLogout } from '@components/Icons'

//@ts-ignore
const popoverButtonStyles = button({ intent: 'primary', aspect: 'popout-primary', scale: 'sm' })

export const PopoverConnectWallet = (props) => {
  const id = createUniqueId()
  const [state, send] = useMachine(popover.machine)
  const ref = useSetup({ send, id })
  const api = createMemo(() => popover.connect(state, send, normalizeProps))
  const { accountData } = useAccount()
  const { disconnect } = useConnect()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useCurrentUserDefaultProfile()

  const [popoverLabel, setPopoverLabel] = createSignal(
    accountData()?.address && walletVerifiedState.connected && walletVerifiedState.verified
      ? shortenEthereumAddress(accountData().address)
      : 'Connect',
  )

  createEffect(() => {
    if (accountData()?.address && walletVerifiedState.connected && walletVerifiedState.verified)
      setPopoverLabel(shortenEthereumAddress(accountData().address))
    else if (walletVerifiedState.loading) setPopoverLabel('Connecting...')
    else setPopoverLabel('Connect')
  })

  return (
    <div class="relative" ref={ref}>
      <button
        classList={{
          [popoverButtonStyles]:
            !walletVerifiedState.verified ||
            !walletVerifiedState.connected ||
            stateFetchDefaultProfile.data === null ||
            !stateFetchDefaultProfile.data ||
            !stateFetchDefaultProfile.data?.picture?.original?.url,
          [popoverStyles.popoverButtonProfile]:
            walletVerifiedState.verified &&
            walletVerifiedState.connected &&
            stateFetchDefaultProfile.data?.picture?.original?.url,
        }}
        {...api().triggerProps}
      >
        <Switch>
          <Match
            when={
              !walletVerifiedState.verified ||
              !walletVerifiedState.connected ||
              stateFetchDefaultProfile.data === null ||
              !stateFetchDefaultProfile.data
            }
          >
            {popoverLabel()}
          </Match>
          <Match
            when={
              walletVerifiedState.verified &&
              walletVerifiedState.connected &&
              stateFetchDefaultProfile.data !== null &&
              stateFetchDefaultProfile.data !== null
            }
          >
            <Switch>
              <Match when={stateFetchDefaultProfile.data?.picture?.original?.url}>
                <img
                  class="rounded-full"
                  height="40px"
                  width="40px"
                  src={stateFetchDefaultProfile.data.picture.original.url}
                  alt=""
                />
              </Match>
              <Match when={!stateFetchDefaultProfile.data?.picture?.original?.url}>{popoverLabel()}</Match>
            </Switch>
          </Match>
        </Switch>
      </button>
      <div {...api().positionerProps}>
        <div
          class={`bg-black mt-4 border-solid overflow-hidden rounded-lg w-[calc(100vw-20px)] xs:w-auto xs:min-w-60 ${popoverStyles.popoverContentBody}`}
          {...api().contentProps}
        >
          <div class="sr-only" {...api().titleProps}>
            Menu wallet
          </div>
          <Switch>
            <Match
              when={
                walletVerifiedState.connected === true &&
                walletVerifiedState.verified === true &&
                !walletVerifiedState.loading
              }
            >
              <div class={`divide-y-1 divide-neutral-6 text-2xs mt-1 font-bold sm:font-semibold bg-black`}>
                <Link
                  class={`flex-col ${popoverStyles.popoverSectionLink}`}
                  href={stateFetchDefaultProfile.data?.handle ? ROUTE_EDIT_PROFILE : ROUTE_ACCOUNT}
                >
                  <Show when={stateFetchDefaultProfile.data?.handle || stateFetchDefaultProfile.data?.handle !== null}>
                    <span class="font-normal text-neutral-400 text-[0.8em]">Logged in as</span>{' '}
                    <span class="overflow-hidden text-ellipsis text-brand-pink">
                      {stateFetchDefaultProfile.data?.handle}
                    </span>
                  </Show>
                  <Show when={!stateFetchDefaultProfile.data?.handle || stateFetchDefaultProfile.data?.handle === null}>
                    {accountData().address && shortenEthereumAddress(accountData().address)}
                  </Show>
                </Link>
                <div>
                  <div class={popoverStyles.popoverSectionName}>Player</div>
                  <ul>
                    <li>
                      <Link class={popoverStyles.popoverSectionLink} href={ROUTE_LIBRARY}>
                        My library
                      </Link>
                    </li>
                    <li>
                      <Link class={popoverStyles.popoverSectionLink} href={ROUTE_FEED}>
                        My feed
                      </Link>
                    </li>
                  </ul>

                  <div class={popoverStyles.popoverSectionName}>Creator</div>
                  <ul>
                    <li>
                      <Link class={popoverStyles.popoverSectionLink} href={ROUTE_DASHBOARD}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link class={popoverStyles.popoverSectionLink} href={ROUTE_CREATE_GAME}>
                        Create new game
                      </Link>
                    </li>
                  </ul>
                </div>

                <button
                  class={`mt-1 border-opacity-10 border-white w-full ${popoverStyles.logoutButton} ${popoverStyles.popoverSectionLink}`}
                  onClick={async () => await disconnect()}
                >
                  <IconLogout class="text-neutral-9 h-[1em] mie-[0.5ch]" />
                  Log out
                </button>
              </div>
            </Match>
            <Match
              when={
                walletVerifiedState.connected === false ||
                walletVerifiedState.verified === false ||
                walletVerifiedState.loading === true
              }
            >
              <div class="bg-true-black">
                <div class="pt-4 space-y-4">
                  <div class="px-2 space-y-3">
                    <ButtonGroupWalletOptions />
                  </div>
                  <div class="px-2 text-center overflow-hidden pb-3 bg-neutral-900">
                    <p class="xs:text-2xs pt-2.5 font-medium">Curious about Ethereum wallets ?</p>
                    <a
                      class="xs:text-2xs font-medium link"
                      href="https://github.com/naomihauret/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn more here
                    </a>
                  </div>
                </div>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default PopoverConnectWallet
