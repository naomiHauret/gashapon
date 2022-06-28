import Button from '@components/Button'
import { Title } from 'solid-meta'

export default function Page() {
  return (
    <>
      <Title>Delete my profile - Gashapon</Title>
      <main class="mx-auto container">
        <h1>Delete my Gashapon profile</h1>
        <p>Warning: deleting your profile is permanent!</p>
        <h2>What does it mean ?</h2>
        <p>
          All the data associated to @[handle] (posts, communities, games, follows, comments...) will be wiped out
          immediately and you won’t be able to access them or restore them.
        </p>
        <p>Your handle (@[handle]) will also be up for grabs.</p>
        <p>Only delete your account if you're ok with this.</p>

        <Button>Delete my account</Button>
      </main>
    </>
  )
}
