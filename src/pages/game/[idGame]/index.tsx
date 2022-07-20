import { useRouteData } from 'solid-app-router'
import { Match, Suspense, Switch } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const game = useRouteData()

  return (
    <>
      <Suspense fallback={<>Loading...</>}>
      <Switch>
        {/* @ts-ignore */}
        <Match when={game()?.error && !game()?.data}>
          <Title>Game not found - Gashapon</Title>
          <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
            <h1 class="mb-4 font-bold text-2xl">This game is a MissingNo !</h1>
            <p class="text-ex font-semibold text-neutral-400">
              It seems like this game doesn't exist or was deleted.
            </p>
          </div>
        </Match>
        <Match when={game()?.data}>
          <Title>{game()?.data?.publication?.metadata?.name} - Gashapon</Title>
          <div class="container mx-auto">
          {/* @ts-ignore */}
          <h1 class='font-bold text-2xl'>{game()?.data?.publication?.metadata?.attributes.}</h1>

          </div>
        </Match>
      </Switch>
    </Suspense>

    </>
  )
}
