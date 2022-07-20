import FormIndexGameData from '@components/_pages/dashboard/game/FormIndexGameData'
import { Title } from 'solid-meta'

export default function Page() {
  return (
    <>
      <Title>Create a new game - Gashapon</Title>
      <main class="mx-auto container animate-appear">
        <h1 class="font-bold mb-3 text-xl">Create new game page</h1>

        <p class="font-semibold text-md mb-3">Let's create and index your game in Gashapon first.</p>
        <p class="text-neutral-500 italic mb-6">You'll set up your sale offers and download files afterwards.</p>
        <FormIndexGameData />
      </main>
    </>
  )
}
