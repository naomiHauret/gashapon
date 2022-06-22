import { createEffect, createUniqueId, Show , createMemo, Switch, Match} from "solid-js";
import { Link, useIsRouting, useLocation, useNavigate } from "solid-app-router";
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import * as dialog from "@zag-js/dialog"
import { ROUTE_COMMUNITY, ROUTE_EXPLORE, ROUTE_SIGN_IN } from "@config/routes";
import PopoverConnectWallet from "@components/PopoverConnectWallet";
import type { PropTypes } from '@zag-js/solid'
import styles from './Navigation/styles.module.css'
import useVerifyUser from "@hooks/useVerifyUser";
import { Portal } from "solid-js/web";
import DialogModal from "@components/DialogModal";
import { IconCircleSolidCheck, IconSpinner } from "@components/Icons";
import Button from "@components/Button";

export const BasicLayout = (props) => {
    const { walletVerifiedState, dialogApi, verify } = useVerifyUser()
    const isRouting = useIsRouting();
    const location = useLocation();
    const navigate = useNavigate();

    createEffect(() => {
        if(location.pathname === ROUTE_SIGN_IN && !isRouting() && walletVerifiedState.connected && walletVerifiedState.verified ) {
            navigate("/", { replace: true });
        }
    })

    createEffect(() => {
        if(walletVerifiedState.connected && walletVerifiedState.verified) dialogApi().close()
    })

    return <>
        <div class="flex mx-auto container">
        <div class="xs:hidden">
            
        </div>
        <div class={`${styles['navlink']} p-1 flex items-center justify-center aspect-square translate-y-[calc(50%+0.5rem)] rounded-full mie-auto xs:mie-0`}>
            <Link href="/">
                <img src="/logo-icon.png" alt="" width="39px" height="30px" />
                <span class="sr-only">Home</span>
            </Link>
        </div>
        <nav class="xs:translate-y-1/2 hidden xs:flex xs:mx-auto font-semibold space-i-12 items-end text-sm">
            <Link class={`${styles['navlink']} ${styles['navlink-desktop']}`} href={ROUTE_EXPLORE}>
                Explore
            </Link>
            <Link  class={`${styles['navlink']} ${styles['navlink-desktop']}`} href={ROUTE_COMMUNITY}>
                Community
            </Link>
        </nav>
        <Show when={location.pathname !== ROUTE_SIGN_IN}>
            <div class="translate-y-3/4">
                <PopoverConnectWallet />
            </div>
        </Show>
        </div>

        <div class="w-full bg-brand-indigo h-1" />
        <div class="w-full bg-brand-yellow h-1 my-0.5" />
        <div class="w-full bg-brand-pink h-1.5" />
        <div class="pt-10 sm:pt-20">
        <Show when={!isRouting()}>
            {props.children}
        </Show>
        </div>
         {dialogApi().isOpen && <Portal>
            <DialogModal api={dialogApi} title="Connect your Ethereum wallet" description="Connect your Ethereum wallet and verify your signature to start using Gashapon.">
                <div classList={{
                        "text-white text-opacity-50": !walletVerifiedState.connected
                    }}
                    class="mb-4"
                    >
                    <div class="flex items-center">
                        <Switch>
                            <Match when={!walletVerifiedState.connected && walletVerifiedState.loading}><IconSpinner class="mie-1ex text-md animate-spin" /></Match>
                            <Match when={walletVerifiedState.connected}><IconCircleSolidCheck class="mie-1ex text-md" /></Match>
                        </Switch>
                    <span class="text-ex font-bold">Step 1/2 : Connect</span>
                    </div>
                    <p class="mt-1">Please confirm the connection in your wallet.</p>
                </div>
                <div classList={{
                        "text-white text-opacity-50": !walletVerifiedState.connected
                    }}>
                    <div class="flex items-center">
                        <Switch>
                            <Match when={walletVerifiedState.connected && !walletVerifiedState.verified && walletVerifiedState.loading}><IconSpinner class="text-md mie-1ex animate-spin" /></Match>
                            <Match when={walletVerifiedState.verified}><IconCircleSolidCheck class="text-md mie-1ex" /></Match>
                        </Switch>
                        <span class="text-ex font-bold">Step 2/2 : Verify</span>

                    </div>
                    <p class="mt-1">Please sign the message in your wallet to verify that you’re the owner of this address.</p>
                </div>
                <Show when={walletVerifiedState.error !== null}>
                    <p class="mt-5 text-rose-400 font-bold">
                        Something went wrong, please try verifying again.
                    </p>
                    <Button onClick={() => verify()} class="mx-auto mt-3">
                        Try again
                    </Button>
                </Show>
            </DialogModal>
        </Portal>}
        
 
    </>
}

export default BasicLayout