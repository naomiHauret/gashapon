import FormSetFollowModule from '@components/_pages/account/edit-profile/FormSetFollowModule'
import useDefaultProfile from '@hooks/useCurrentUserDefaultProfile'
import { createEffect } from 'solid-js'
import { Title } from 'solid-meta'

export default function Page() {
  return (
    <>
      <Title>Follow settings - Gashapon</Title>
      <main>
        <FormSetFollowModule />
      </main>
    </>
  )
}
