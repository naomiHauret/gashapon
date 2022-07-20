import Button from '@components/Button'
import * as dialog from '@zag-js/dialog'
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import DialogSendTip from '@components/DialogSendTip'
import { IconItch, IconTwitch, IconTwitter, IconWebsite } from '@components/Icons'
import useAccount from '@hooks/useAccount'
import useIsFollowing from '@hooks/useIsFollowing'
import useNetwork from '@hooks/useNetwork'
import useVerifyUser from '@hooks/useVerifyUser'
import { createEffect, For, Show, createMemo } from 'solid-js'
import { Portal } from 'solid-js/web'
import ButtonFollow from './ButtonFollow'

const Icons = {
  website: {
    icon: IconWebsite,
    prefix: '',
  },
  itch: {
    icon: IconItch,
    prefix: 'https://itch.io/',
  },
  twitter: {
    icon: IconTwitter,
    prefix: 'https://twitter.com/',
  },
  twitch: {
    icon: IconTwitch,
    prefix: 'https://twitch.tv/',
  },
}

export const UserProfileLayout = (props) => {
  const { networkData } = useNetwork()
  const { accountData } = useAccount()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  //@ts-ignore
  const { stateIsFollowingThisProfile, checkIfIsFollowing } = useIsFollowing()
  const [stateDialogSendTip, sendDialogSendTip] = useMachine(dialog.machine)
  const refDialogSendTip = useSetup({ send: sendDialogSendTip, id: 'dialog-send-tip' })
  const apiDialogSendTip = createMemo(() => dialog.connect(stateDialogSendTip, sendDialogSendTip, normalizeProps))

  // Update UI with custom user data
  createEffect(() => {
    const root = document.querySelector(':root')
    //@ts-ignore
    root.style.setProperty(
      '--accent-user-profile',
      props?.profile?.attributes.filter((attr) => attr.key === 'gashaponProfileAccentColor')[0]?.value,
    )
  })

  createEffect(async () => {
    if (accountData()?.address && props?.profile?.id) await checkIfIsFollowing(props?.profile?.id)
  })

  return (
    <>
      <Show when={props?.profile}>
        <div class="animate-appear pt-12 relative flex-grow flex flex-col w-full max-w-screen-sm mx-auto">
          <Show when={props?.profile?.coverPicture?.original?.url}>
            <div class="rounded-xl overflow-hidden">
              <div class="relative z-10 md:flex md:justify-center">
                <img
                  class="bg-neutral-900 aspect-banner rounded-lg object-cover w-full"
                  src={props?.profile?.coverPicture?.original?.url}
                />
              </div>
            </div>
          </Show>
          <div class="flex space-i-4">
            <section class="w-auto flex flex-col px-8 pb-5 mt-3">
              <div class="bg-neutral-900 mb-4 -mt-14 ring-8 ring-black relative z-10 rounded-xl aspect-square overflow-hidden w-24">
                <img class="bg-neutral-900" src={props?.profile?.picture?.original?.url} />
              </div>
              <span class="font-bold">{props?.profile?.name}</span>
              <span class="font-bold text-brand-pink font-mono">{props?.profile?.handle}</span>
              <div class="text-2xs mt-3">
                <div>
                  <span class="font-bold text-md">
                    {new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 3,
                    }).format(parseInt(props?.profile?.stats?.totalFollowing))}
                  </span>{' '}
                  <span class="pis-1ex">following</span>
                </div>
                <div>
                  <span class="font-bold text-md">
                    {new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 3,
                    }).format(parseInt(props?.profile?.stats?.totalFollowers))}
                  </span>{' '}
                  <span class="pis-1ex">followers</span>
                </div>
              </div>
              <div class="flex flex-col space-y-3 mt-4">
                <div>
                  <ButtonFollow profile={props?.profile} />
                </div>
                <Button
                  ref={refDialogSendTip}
                  {...apiDialogSendTip().triggerProps}
                  disabled={
                    !networkData()?.chain ||
                    networkData()?.chain?.unsupported === true ||
                    walletVerifiedState.verified === false
                  }
                  style={{
                    '--accent': props?.profile?.attributes.filter(
                      (attr) => attr.key === 'gashaponProfileAccentColor',
                    )[0]?.value,
                  }}
                  intent="accent"
                  class="w-max-content h-fit-content"
                  scale="xs"
                >
                  Tip
                </Button>
              </div>
              <Show
                when={
                  props?.profile?.attributes.filter(
                    (attr) =>
                      ['website', 'twitter', 'itch', 'twitch'].includes(attr.key) &&
                      attr.value !== null &&
                      attr.value !== '',
                  ).length > 0
                }
              >
                <ul class="pt-6 space-y-3 flex flex-col text-2xs font-semibold text-tinted-neutral-300">
                  <For
                    each={props?.profile?.attributes.filter(
                      (attr) =>
                        ['website', 'twitter', 'itch', 'twitch'].includes(attr.key) &&
                        attr.value !== null &&
                        attr.value !== '',
                    )}
                  >
                    {/* @ts-ignore */}
                    {(social) => (
                      <li>
                        {/* @ts-ignore */}
                        <a class="flex items-baseline" href={`${Icons[social.key].prefix}${social.value}`}>
                          {/* @ts-ignore */}
                          {Icons[social.key].icon}
                          {/* @ts-ignore */}
                          <span class="pis-1ex">{social.value}</span>
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </section>
            {props.children}
          </div>
        </div>
        {apiDialogSendTip().isOpen && (
          <Portal>
            <DialogSendTip api={apiDialogSendTip} />
          </Portal>
        )}
      </Show>
      <Show when={!props?.profile}>...</Show>
    </>
  )
}

export default UserProfileLayout
