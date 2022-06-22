import { useParams } from 'solid-app-router'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  return (
    <>
      <Title>
        {params.idGame} * Community {params.idCommunity} - Gashapon
      </Title>
      <main class="mx-auto container">Detailed game community goes here (list followers, posts, members)</main>
    </>
  )
}
