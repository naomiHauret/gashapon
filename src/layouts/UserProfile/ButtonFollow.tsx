import Button from '@components/Button'
import useAccount from '@hooks/useAccount'
import useBalance from '@hooks/useBalance'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import useIsFollowing from '@hooks/useIsFollowing'
import useNetwork from '@hooks/useNetwork'
import useVerifyUser from '@hooks/useVerifyUser'
import { createEffect, Match, Show, Switch } from 'solid-js'
import useFollow from '@hooks/useFollow'
import useUnfollow from '@hooks/useUnfollow'

export const ButtonFollow = (props) => {
  const { networkData } = useNetwork()
  const { accountData } = useAccount()
  //@ts-ignore
  const { walletVerifiedState } = useVerifyUser()
  //@ts-ignore
  const { stateFetchDefaultProfile } = useDefaultProfile()
  const { stateIsFollowingThisProfile, checkIfIsFollowing } = useIsFollowing()
  const { followProfile, stateFollowRequest } = useFollow()
  const { unfollowProfile, stateUnfollowRequest } = useUnfollow()
  const { balanceState } = useBalance()

  createEffect(async () => {
    if (accountData()?.address && props?.profile?.id) await checkIfIsFollowing(props?.profile?.id)
  })

  return (
    <>
      <Button
        disabled={
          stateIsFollowingThisProfile.data === null ||
          !networkData()?.chain ||
          networkData()?.chain?.unsupported === true ||
          walletVerifiedState.verified === false ||
          props?.profile?.followModule?.type === 'RevertFollowModule' ||
          (props?.profile?.followModule?.type === 'FeeFollowModule' &&
            (balanceState.loading ||
              parseFloat(balanceState?.balanceOf?.[props?.profile?.followModule?.amount?.asset?.address]?.formatted) <
                parseFloat(props?.profile?.followModule?.amount?.value))) ||
          (!stateFetchDefaultProfile?.data?.id && props?.profile?.followModule?.type === 'ProfileFollowModule')
        }
        isLoading={stateFollowRequest.isLoading === true || stateUnfollowRequest.isLoading}
        onClick={async () => {
          if (stateIsFollowingThisProfile.data !== null && stateIsFollowingThisProfile?.data[0]?.follows === true) {
            await unfollowProfile(props?.profile)
          } else {
            await followProfile(props?.profile)
          }
        }}
        style={{
          '--accent': props?.profile?.attributes.filter((attr) => attr.key === 'gashaponProfileAccentColor')[0]?.value,
        }}
        intent="accent-revert"
        aspect="outline-sm"
        class="w-max-content h-fit-content"
        scale="xs"
      >
        <Switch>
          <Match
            when={stateIsFollowingThisProfile.data !== null && stateIsFollowingThisProfile?.data[0]?.follows === true}
          >
            <Switch fallback="Unfollow">
              <Match when={!stateUnfollowRequest.isLoading && !stateUnfollowRequest.isError}>Unfollow</Match>
              <Match when={stateUnfollowRequest.isLoading}>Unfollowing...</Match>
              <Match when={stateUnfollowRequest.isError}>Try again</Match>
            </Switch>
          </Match>
          <Match
            when={stateIsFollowingThisProfile.data === null || stateIsFollowingThisProfile.data[0]?.follows === false}
          >
            <Switch fallback="Follow">
              <Match when={!stateFollowRequest.isLoading && !stateFollowRequest.isError}>Follow</Match>
              <Match when={stateFollowRequest.isLoading}>Following...</Match>
              <Match when={stateFollowRequest.isError}>Try again</Match>
            </Switch>
          </Match>
        </Switch>
      </Button>
      <Show when={stateIsFollowingThisProfile.data === null || stateIsFollowingThisProfile.data[0]?.follows === false}>
        <div class="text-[0.765rem] text-white text-opacity-50 mt-1">
          <Switch>
            <Match when={props?.profile?.followModule === null}>Following {props?.profile?.name} is free</Match>
            <Match when={props?.profile?.followModule?.type === 'RevertFollowModule'}>
              No one can follow {props?.profile?.name}
            </Match>
            <Match when={props?.profile?.followModule?.type === 'FeeFollowModule'}>
              Follow {props?.profile?.name} for <br />{' '}
              <span class="font-bold">
                {props?.profile?.followModule?.amount?.value} {props?.profile?.followModule?.amount?.asset?.symbol}
              </span>
            </Match>
            <Match when={props?.profile?.followModule?.type === 'ProfileFollowModule'}>
              Only people with a profile <br />
              can follow {props?.profile?.name}
            </Match>
          </Switch>
        </div>
      </Show>
    </>
  )
}

export default ButtonFollow
