import FormEditProfile from '@components/_pages/my-profile/FormEditProfile'
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
      <Title>Edit my profile - Gashapon</Title>
      <main class="pb-20 animate-appear">
        <FormEditProfile />
      </main>
    </>
  )
}
