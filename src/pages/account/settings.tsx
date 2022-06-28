import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  const { stateFetchDefaultProfile } = useDefaultProfile()
  createEffect(() => {
    console.log(stateFetchDefaultProfile)
  })
  return (
    <>
      <Title>Collect settings - Gashapon</Title>
      <main class="mx-auto container">collect settings</main>
    </>
  )
}
