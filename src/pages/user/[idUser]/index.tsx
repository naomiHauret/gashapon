import { useParams } from 'solid-app-router'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  return (
    <>
      <Title>{params.id} - Gashapon</Title>
      <main class="mx-auto container">User profile goes here (with their posts)</main>
    </>
  )
}
