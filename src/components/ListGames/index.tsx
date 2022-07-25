import { DICTIONNARIES_ICONS_PLATFORMS, IconClose } from '@components/Icons'
import PopoverListGamesFilters from '@components/PopoverListGamesFilters'
import { ROUTE_GAME } from '@config/routes'
import { PLATFORMS } from '@helpers/gamePlatforms'
import useFilterListGames from '@hooks/useFilterListGames'
import { Link } from 'solid-app-router'
import { For, Show } from 'solid-js'

export const ListGames = (props) => {
  const { renderList, tagsOptions, genresOptions, platformsOptions, storeForm } = useFilterListGames(props.games)
  const { form } = storeForm

  return (
    <>
      <div class="flex xs:items-center xs:justify-between flex-col xs:flex-wrap xs:flex-row">
        <h2 class="font-bold text-md mb-2 xs:mb-0">
          {props.games.length} game{renderList().length > 1 && 's'}
        </h2>
        <div class="flex flex-col space-y-4 xs:space-y-0 xs:flex-row xs:space-i-6">
          <form use:form>
            <PopoverListGamesFilters
              storeForm={storeForm}
              numberAppliedFiltersPlatforms={storeForm?.data()?.platforms?.length ?? 0}
              numberAppliedFiltersGenres={storeForm?.data()?.genres?.length ?? 0}
              numberAppliedFiltersTags={storeForm?.data()?.tags?.length ?? 0}
              tagsOptions={tagsOptions()}
              platformsOptions={platformsOptions()}
              genresOptions={genresOptions()}
            />
          </form>
        </div>
      </div>
      <Show
        when={
          storeForm?.data()?.platforms?.length > 0 ||
          storeForm?.data()?.genres?.length > 0 ||
          storeForm?.data()?.tags?.length > 0
        }
      >
        <section class="mt-6">
          <span class="text-white text-opacity-75 font-bold text-1ex">
            {' '}
            {renderList().length} game{renderList().length > 1 && 's'} matching
          </span>
          <ul class="flex flex-wrap mt-1">
            <Show when={storeForm?.data()?.platforms?.length > 0}>
              <For each={storeForm?.data()?.platforms}>
                {(platform) => (
                  <li class="border-4 border-black border-solid">
                    <div class="flex items-center relative text-2xs bg-neutral-500 bg-opacity-15 focus-within:bg-opacity-25 border border-solid border-white border-opacity-10 rounded-full px-3 py-0.5 font-semibold">
                      <button
                        class="absolute top-0 left-0 w-full h-full z-10 opacity-0"
                        onClick={() =>
                          storeForm.setFields(
                            'platforms',
                            storeForm.data().platforms.filter((value) => value !== platform),
                          )
                        }
                      >
                        remove filter "{platform}"
                      </button>
                      <IconClose class="mie-1ex opacity-75" />
                      <span>{platform}</span>
                    </div>
                  </li>
                )}
              </For>
            </Show>
            <Show when={storeForm?.data()?.genres?.length > 0}>
              <For each={storeForm?.data()?.genres}>
                {(genre) => (
                  <li class="border border-black border-solid">
                    <div class="flex items-center relative text-2xs bg-neutral-500 bg-opacity-15 focus-within:bg-opacity-25 border border-solid border-white border-opacity-10 rounded-full px-3 py-0.5 font-semibold">
                      <button
                        class="absolute top-0 left-0 w-full h-full z-10 opacity-0"
                        onClick={() =>
                          storeForm.setFields(
                            'genres',
                            storeForm.data().genres.filter((value) => value !== genre),
                          )
                        }
                      >
                        remove filter "{genre}"
                      </button>
                      <IconClose class="mie-1ex opacity-75" />
                      <span>{genre}</span>
                    </div>
                  </li>
                )}
              </For>
            </Show>
            <Show when={storeForm?.data()?.tags?.length > 0}>
              <For each={storeForm?.data()?.tags}>
                {(tag) => (
                  <li class="border border-black border-solid">
                    <div class="flex items-center relative text-2xs bg-neutral-500 bg-opacity-15 focus-within:bg-opacity-25 border border-solid border-white border-opacity-10 rounded-full px-3 py-0.5 font-semibold">
                      <button
                        class="absolute top-0 left-0 w-full h-full z-10 opacity-0"
                        onClick={() =>
                          storeForm.setFields(
                            'tags',
                            storeForm.data().tags.filter((value) => value !== tag),
                          )
                        }
                      >
                        remove filter "{tag}"
                      </button>
                      <IconClose class="mie-1ex opacity-75" />
                      <span>{tag}</span>
                    </div>
                  </li>
                )}
              </For>
            </Show>
          </ul>
        </section>
      </Show>
      <div>
        <ul class="mt-8 space-y-6">
          <For each={renderList()}>
            {(game) => (
              <li class="animate-appear relative bg-neutral-500 bg-opacity-10 focus-within:bg-opacity-15 md:bg-opacity-0">
                <article class="flex flex-col md:flex-row md:space-i-6">
                  <div class="rounded-t-md overflow-hidden md:rounded-none w-full aspect-banner md:w-auto md:h-inherit md:max-w-1/3">
                    <img
                      class="w-full h-full object-cover"
                      src={game.metadata.attributes.filter((attr) => attr.traitType === 'banner')[0]?.value}
                      alt=""
                    />
                  </div>
                  <div class="rounded-b-md md:rounded-b-0 border md:border-0 border-solid border-white border-opacity-10 p-4 md:px-0">
                    <header class="font-bold text-xl mb-3.5">
                      <h1 class="md:leading-none flex flex-col">
                        {game.metadata.attributes.filter((attr) => attr.traitType === 'title')[0]?.value}
                        <span class="text-2xs italic text-neutral-500 mt-2">
                          by {game.metadata.attributes.filter((attr) => attr.traitType === 'developmentTeam')[0]?.value}{' '}
                        </span>
                      </h1>
                    </header>
                    <p class="text-2xs text-neutral-300 mt-2">
                      {game.metadata.attributes.filter((attr) => attr.traitType === 'tagline')[0]?.value}
                    </p>
                    <section class="mt-4">
                      <h2 class="sr-only">Available on: </h2>
                      <ul class="flex space-i-4 text-neutral-200 items-center">
                        <Show
                          when={game.metadata.attributes
                            .filter((attr) => attr.traitType === 'platforms')[0]
                            ?.value?.includes(PLATFORMS.BROWSER)}
                        >
                          <li class="text-3xs font-semibold inline-flex rounded-md bg-neutral-600 text-white px-2 py-0.5">
                            Play in browser
                          </li>
                        </Show>

                        <For
                          each={game.metadata.attributes
                            .filter((attr) => attr.traitType === 'platforms')[0]
                            ?.value?.split(';')}
                        >
                          {(platform) => (
                            <Show when={platform !== PLATFORMS.BROWSER}>
                              <li
                                classList={{
                                  'text-3xl': platform === PLATFORMS.MACOS,
                                  //@ts-ignore
                                  'text-sm': ![PLATFORMS.MACOS, PLATFORMS.BROWSER].includes(platform),
                                }}
                              >
                                {DICTIONNARIES_ICONS_PLATFORMS[platform]}
                                <span class="sr-only">{platform}</span>
                              </li>
                            </Show>
                          )}
                        </For>
                      </ul>
                    </section>
                    <section class="mt-4 text-2xs">
                      <h2 class="sr-only">Genres</h2>
                      <ul class="space space-i-4 flex">
                        <For
                          each={game.metadata.attributes
                            .filter((attr) => attr.traitType === 'genres')[0]
                            ?.value?.split(';')}
                        >
                          {(genre) => <li class="text-neutral-400">{genre}</li>}
                        </For>
                      </ul>
                    </section>
                  </div>
                </article>
                <Link
                  href={ROUTE_GAME.replace(':idGame', game.id)}
                  class="absolute top-0 left-0 w-full h-full opacity-0 z-10"
                >
                  View game page
                </Link>
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  )
}
