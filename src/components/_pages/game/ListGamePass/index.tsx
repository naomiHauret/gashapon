import Button from '@components/Button'
import { IconLock } from '@components/Icons'
import { getPublications } from '@graphql/publications/get-publications'
import useAccount from '@hooks/useAccount'
import useIsFollowing from '@hooks/useIsFollowing'
import usePurchaseGamePass from '@hooks/usePurchaseGamePass'
import { addHours, format, isAfter, isBefore } from 'date-fns'
import { useParams } from 'solid-app-router'
import { createEffect, createResource, For, Match, Show, Suspense, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import DialogTrackModalProgress from './DialogTrackModalProgress'

async function fetchGamePassData(profileId) {
  const params = useParams()
  const listGamePass = await getPublications({
    profileId: profileId,
    publicationTypes: ['POST'],
    metadata: {
      tags: {
        all: ['gamePass', 'gashapon', params.idGame.replace('-', '')],
      },
    },
  })
  return listGamePass
}

export const ListGamePass = (props) => {
  const [listGamePass] = createResource(() => props.profileId, fetchGamePassData)
  const { accountData } = useAccount()
  const { stateIsFollowingThisProfile, checkIfIsFollowing } = useIsFollowing()
  const { updateGamePassMetadata, showWaitMessage, stateIndexPurchaseGamePass, apiDialogModalTrackProgress } =
    usePurchaseGamePass()

  createEffect(() => {
    if (accountData()?.address) checkIfIsFollowing(props.profileId)
  })

  return (
    <Suspense fallback={<>...</>}>
      <Show when={listGamePass()?.data?.publications?.items?.length === 0}>
        <span class="italic text-neutral-400 text-2xs">Not available to purchase yet</span>
      </Show>
      <Show when={listGamePass()?.data?.publications?.items?.length > 0}>
        <ul class="space-y-4">
          <For each={listGamePass()?.data?.publications?.items}>
            {(gamePass) => {
              const limitDate = addHours(new Date(gamePass?.createdAt), 24)

              if (gamePass.type === 'TimedFeeCollectModule' || gamePass.type === 'LimitedTimedFeeCollectModule') {
                if (isAfter(new Date(), limitDate)) return <></>
              }
              return (
                <li>
                  <Button
                    class="w-full xs:w-auto"
                    scale="xs"
                    intent="primary--revert"
                    aspect="outline-sm"
                    //@ts-ignore
                    onClick={() => updateGamePassMetadata(gamePass?.id)}
                    disabled={
                      stateIsFollowingThisProfile?.data === null ||
                      (accountData()?.address &&
                        stateIsFollowingThisProfile?.data?.[0]?.follows === false &&
                        //@ts-ignore
                        gamePass?.collectModule?.followerOnly === true)
                    }
                  >
                    <Show
                      when={
                        stateIsFollowingThisProfile?.data === null ||
                        (accountData()?.address &&
                          stateIsFollowingThisProfile?.data?.[0]?.follows === false &&
                          //@ts-ignore
                          gamePass?.collectModule?.followerOnly === true)
                      }
                    >
                      <IconLock class="mie-1 text-md" />
                    </Show>
                    <Switch>
                      {/* @ts-ignore */}
                      <Match when={gamePass?.collectModule?.type === 'FreeCollectModule'}>Purchase for free</Match>
                    </Switch>
                    <Switch>
                      {/* @ts-ignore */}
                      <Match when={gamePass?.collectModule?.type !== 'FreeCollectModule'}>
                        {/* @ts-ignore */}
                        Purchase for {gamePass?.collectModule?.amount?.value} {/* @ts-ignore */}
                        {gamePass?.collectModule?.amount?.asset?.symbol}
                      </Match>
                    </Switch>
                  </Button>
                  <Show
                    when={
                      (gamePass.type === 'TimedFeeCollectModule' || gamePass.type === 'LimitedTimedFeeCollectModule') &&
                      isBefore(new Date(), limitDate)
                    }
                  >
                    <span>Valid until&nbsp;{format(limitDate, 'PPpp')}</span>
                  </Show>
                  <Show
                    when={
                      accountData()?.address &&
                      stateIsFollowingThisProfile?.data?.[0]?.follows === false &&
                      //@ts-ignore
                      gamePass?.collectModule?.followerOnly === true
                    }
                  >
                    <span class="text-3xs block mt-2 text-neutral-400 italic">Available for followers only</span>
                  </Show>
                </li>
              )
            }}
          </For>
        </ul>
        {apiDialogModalTrackProgress().isOpen && (
          <Portal>
            <DialogTrackModalProgress
              stateIndexPurchaseGamePass={stateIndexPurchaseGamePass}
              showWaitMessage={showWaitMessage}
              api={apiDialogModalTrackProgress}
            />
          </Portal>
        )}
      </Show>
    </Suspense>
  )
}

export default ListGamePass
