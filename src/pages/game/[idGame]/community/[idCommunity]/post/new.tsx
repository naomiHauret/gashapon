import { useParams } from 'solid-app-router'
import { Title } from 'solid-meta'

export default function Page() {
  const params = useParams()
  return (
    <>
      <Title>New community post - Gashapon</Title>
      <main class="mx-auto container">Form to create a new community post goes here</main>
    </>
  )
}
