import { createMemo, createEffect, createSignal, Match, Switch, createUniqueId, Show } from "solid-js"
import * as popover from "@zag-js/popover"
import { normalizeProps, useMachine, useSetup } from "@zag-js/solid"
import ButtonGroupWalletOptions from "@components/ButtonGroupWalletOptions"
import useAccount from "@hooks/useAccount"
import useConnect from "@hooks/useConnect"
import button from '@components/Button//button'
import { shortenEthereumAddress } from "@helpers/shortenEthereumAddress"
import popoverStyles from './styles.module.css'
import type { PropTypes } from "@zag-js/solid"
import useVerifyUser from "@hooks/useVerifyUser"
import useCurrentUserDefaultProfile from "@hooks/useCurrentUserDefaultProfile"
import { Link } from "solid-app-router"
import { ROUTE_PROFILE } from "@config/routes"
import { IconLogout } from "@components/Icons"

const popoverButtonStyles = button({ intent: 'primary', aspect: 'popout-primary', scale: 'sm'})

export const PopoverConnectWallet = (props) => {
  const id = createUniqueId()
  const [state, send] = useMachine(popover.machine)
  const ref = useSetup({ send, id })
  const api = createMemo(() => popover.connect<PropTypes>(state, send, normalizeProps))
    const { accountData } = useAccount()
    const { disconnect } = useConnect()
    const { walletVerifiedState } = useVerifyUser()
    const { stateFetchDefaultProfile, fetchDefaultProfilev} = useCurrentUserDefaultProfile()

    const [popoverLabel, setPopoverLabel] = createSignal(
      accountData()?.address && walletVerifiedState.connected  && walletVerifiedState.verified ? shortenEthereumAddress(accountData().address) : 'Connect',
    )
    
      createEffect(() => {
        if (accountData()?.address && walletVerifiedState.connected && walletVerifiedState.verified) setPopoverLabel(shortenEthereumAddress(accountData().address))
        else if (walletVerifiedState.loading) setPopoverLabel('Connecting...')
        else  setPopoverLabel('Connect')
      })

    return  <div class="relative" ref={ref}>
      <button 
        classList={{
          [popoverButtonStyles]: !walletVerifiedState.verified || !walletVerifiedState.connected || stateFetchDefaultProfile.data === null || !stateFetchDefaultProfile.data || !stateFetchDefaultProfile.data?.picture?.original?.url,
          [popoverStyles.popoverButtonProfile]: walletVerifiedState.verified && walletVerifiedState.connected && stateFetchDefaultProfile.data?.picture?.original?.url
        }}
      
       {...api().triggerProps}>
        <Switch>
          <Match when={(!walletVerifiedState.verified || !walletVerifiedState.connected) ||  (stateFetchDefaultProfile.data === null || !stateFetchDefaultProfile.data)}>
            {popoverLabel()}
          </Match>
          <Match when={walletVerifiedState.verified && walletVerifiedState.connected && stateFetchDefaultProfile.data !== null && stateFetchDefaultProfile.data !== null}>
            <Switch>
              <Match when={stateFetchDefaultProfile.data?.picture?.original?.url}>
                <img class="rounded-full" height="40px" width="40px" src={stateFetchDefaultProfile.data.picture.original.url} alt="" />
              </Match>
              <Match when={!stateFetchDefaultProfile.data?.picture?.original?.url}>
                {popoverLabel()}
              </Match>
            </Switch>
          </Match>
        </Switch>

      </button>
      <div {...api().positionerProps}>
        <div class={`bg-black mt-4 border-solid overflow-hidden rounded-lg ${popoverStyles.popoverContentBody}`} {...api().contentProps}>
          <div class='sr-only' {...api().titleProps}>Menu wallet</div>
          <Switch>
              <Match
                when={
                  walletVerifiedState.connected === true  && walletVerifiedState.verified === true && !walletVerifiedState.loading
                }
              >
                <div class={`divide-y-1 divide-neutral-6 text-2xs mt-1 font-bold sm:font-semibold bg-black`}>
                  <Link class="px-4 py-1.5 flex flex-col hover:bg-white hover:bg-opacity-10" href={ROUTE_PROFILE}>
                    <Show when={stateFetchDefaultProfile.data?.handle || stateFetchDefaultProfile.data?.handle !== null}>
                      <span class="font-normal text-[0.75em]">Logged in as</span> <span class="overflow-hidden text-ellipsis text-brand-pink">{stateFetchDefaultProfile.data?.handle}</span>
                      
                    </Show>
                    <Show when={!stateFetchDefaultProfile.data?.handle || stateFetchDefaultProfile.data?.handle === null}>
                      My profile
                    </Show>
                  </Link>

                  <span>My library</span>
                  <span>My feed</span>

                  <div>
                    Creator
                  </div>
                  <span>Upload new game</span>
                  <span>Dashboard</span>

                  <button
                    class="py-1.5 px-4 w-full flex items-center hover:bg-white hover:bg-opacity-10"
                    onClick={disconnect}
                  >
                    <IconLogout class="text-neutral-9 h-[1em] mie-[0.5ch]" />
                    Log out
                  </button>
                </div>
              </Match>
              <Match
                when={
                  walletVerifiedState.connected === false ||
                  walletVerifiedState.loading === true
                }
              >
                <div class='bg-true-black'>
                  <div class="pt-4 space-y-4">
                    <div class="px-4 space-y-3">
                      <ButtonGroupWalletOptions />
                    </div>
                    <div class="px-4 text-center overflow-hidden pb-3 bg-gray-900">
                      <p class="xs:text-2xs text-gray-12 pt-2.5 font-medium">Curious about Ethereum wallets ?</p>
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
}

export default PopoverConnectWallet