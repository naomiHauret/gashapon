import { useParams } from 'solid-app-router'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  return (
    <>
      <Title>Community post {params.idCommunityPost} - Gashapon</Title>
      <main class="mx-auto container">Detailed community post goes here</main>
    </>
  )
}
