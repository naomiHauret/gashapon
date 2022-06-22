import { useParams } from 'solid-app-router'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  return (
    <>
      <Title>
        {params.idGame} - update {params.idUpdaet} - Gashapon
      </Title>
      <main class="mx-auto container">Detailed user post goes here</main>
    </>
  )
}
