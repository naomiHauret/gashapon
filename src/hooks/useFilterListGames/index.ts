import { createForm } from '@felte/solid'
import { createEffect, createMemo, createSignal } from 'solid-js'

export function useFilterListGames(list) {
  const storeForm = createForm({
    onSubmit: (values) => {
      console.log(values)
    },
  })
  const [tagsOptions, setTagsOptions] = createSignal(
    Array.from(
      new Set(
        list
          .map((game) => game.metadata.attributes.filter((attr) => attr.traitType === 'tags')[0]?.value?.split(';'))
          .flat(),
      ),
    ),
  )
  const [genresOptions, setGenresOptions] = createSignal(
    Array.from(
      new Set(
        list
          .map((game) => game.metadata.attributes.filter((attr) => attr.traitType === 'genres')[0]?.value?.split(';'))
          .flat(),
      ),
    ),
  )
  const [platformsOptions, setPlatformsOptions] = createSignal(
    Array.from(
      new Set(
        list
          .map((game) =>
            game.metadata.attributes.filter((attr) => attr.traitType === 'platforms')[0]?.value?.split(';'),
          )
          .flat(),
      ),
    ),
  )
  const renderList = createMemo(() => filterList())

  function filterList() {
    return list
      .filter((game) => {
        if (storeForm.data()?.['genres'])
          return game.metadata.attributes
            .filter((attr) => attr.traitType === 'genres')[0]
            ?.value.includes(storeForm.data()?.['genres']?.join(';'))
        return game
      })
      .filter((game) => {
        if (storeForm.data()?.['platforms'])
          return game.metadata.attributes
            .filter((attr) => attr.traitType === 'platforms')[0]
            ?.value.includes(storeForm.data()?.['platforms']?.join(';'))
        return game
      })
      .filter((game) => {
        if (storeForm.data()?.['genres'])
          return game.metadata.attributes
            .filter((attr) => attr.traitType === 'genres')[0]
            ?.value.includes(storeForm.data()?.['genres']?.join(';'))
        return game
      })
  }

  return {
    renderList,
    tagsOptions,
    genresOptions,
    platformsOptions,
    storeForm,
  }
}

export default useFilterListGames
