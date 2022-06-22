import { useParams } from 'solid-app-router'
import { createEffect } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  createEffect(() => {
    console.log(params)
  })
  return (
    <>
      <Title>{params.idGame} - Gashapon</Title>
      <main class="mx-auto container">Game data + buy/support + latest updates goes here</main>
    </>
  )
}
