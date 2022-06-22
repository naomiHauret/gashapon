import { Title } from 'solid-meta'

export default function NotFound() {
  return (
    <>
      <Title>Page not found - Gashapon</Title>
      <section class="container mx-auto text-center py-10">
        <h1 class="text-3xl font-bold text-white">Page not found.</h1>
        <p class="mt-3 text-slate-500 text-lg">Either it never existed or we deleted it. 😞</p>
      </section>
    </>
  )
}
