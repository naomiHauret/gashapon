import Button from '@components/Button'
import { useUserGameLibrary } from '@hooks/useUserGameLibrary'
import { Match, Show, Suspense, Switch } from 'solid-js'

export const ListGames = () => {
  const { userLibrary, refreshData } = useUserGameLibrary()

  return (
    <div class="animate-appear">
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-bold mb-3 text-lg">Game library</h2>
        <Show when={userLibrary.loading === false}>
          <Button aspect="outline-sm" onClick={refreshData} scale="xs" intent="primary--revert">
            Refresh
          </Button>
        </Show>
      </div>

      <Suspense fallback={<div class="animate-appear">Loading...</div>}>
        <Switch>
          <Match when={userLibrary()?.data?.publications?.items.length === 0}>
            <span class="italic text-neutral-400">You didn't purchase any game pass yet.</span>
          </Match>
          <Match when={userLibrary()?.data?.publications?.items.length > 0}>list</Match>
        </Switch>
      </Suspense>
    </div>
  )
}

export default ListGames
