import { useRouteData } from 'solid-app-router'
import { Match, Suspense, Switch, Show, For, createMemo, createUniqueId, createEffect, createSignal } from 'solid-js'
import { Title } from 'solid-meta'
import { PLATFORMS } from '@helpers/gamePlatforms'
import {
  DICTIONNARIES_ICONS_PLATFORMS,
  IconGooglePlay,
  IconItchIo,
  IconPlatformMacOS,
  IconSteam,
  IconWebsite,
} from '@components/Icons'
import DialogSliderScreenshots from '@components/_pages/game/DialogSliderScreenshots'
import { Portal } from 'solid-js/web'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/solid'
import GameDescription from '@components/_pages/game/GameDescription'
import ListGamePass from '@components/_pages/game/ListGamePass'

export default function Page() {
  const data = useRouteData()
  const [initialSlide, setInitialSlide] = createSignal(0)
  const [stateDialogModalScreenshots, sendDialogModalScreenshots] = useMachine(
    dialog.machine({
      id: createUniqueId(),
      closeOnOutsideClick: true,
      closeOnEsc: true,
      preventScroll: true,
    }),
  )

  const apiDialogModalScreenshots = createMemo(() =>
    dialog.connect(stateDialogModalScreenshots, sendDialogModalScreenshots, normalizeProps),
  )

  return (
    <>
      <Suspense fallback={<div class="flex justify-center items-center">Loading...</div>}>
        <Switch>
          {/* @ts-ignore */}
          <Match when={data?.game()?.error && !data?.game()?.data}>
            <Title>Game not found - Gashapon</Title>
            <div class="mt-32 container mx-auto flex flex-col justify-start items-start xs:items-center xs:justify-center">
              <h1 class="mb-4 font-bold text-2xl">This game is a MissingNo !</h1>
              <p class="text-ex font-semibold text-neutral-400">
                It seems like this game doesn't exist or was deleted.
              </p>
            </div>
          </Match>
          <Match when={data?.game()?.data}>
            <Title>{data?.game()?.data?.publication?.metadata?.name} - Gashapon</Title>
            <div class="animate-appear relative container mx-auto flex flex-col md:flex-row md:space-i-10">
              {/* @ts-ignore */}
              <div class="md:w-1/3 relative mb-6 md:mb-0">
                <div class="md:sticky md:top-6">
                  <div class="relative aspect-game-thumbnail w-full">
                    <div class="absolute bg-white bg-opacity-10 top-0 left-0 w-full h-full animate-pulse" />
                    <img
                      class="w-full z-10 h-full object-cover"
                      src={
                        data
                          ?.game()
                          ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'thumbnail')[0]
                          ?.value
                      }
                    />
                  </div>

                  <h1 class="pt-4 pb-3 font-bold text-2xl">
                    {
                      data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'title')[0]?.value
                    }
                  </h1>
                  <p class="text-sm text-neutral-300">
                    {
                      data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'tagline')[0]
                        ?.value
                    }
                  </p>

                  <ul class="mt-4 flex space-i-4 text-neutral-200 items-center">
                    <Show
                      when={data
                        ?.game()
                        ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'platforms')[0]
                        ?.value?.split(';')
                        .includes(PLATFORMS.BROWSER)}
                    >
                      <li class="text-2xs font-semibold inline-flex rounded-md bg-neutral-600 text-white px-2 py-0.5">
                        Play in browser
                      </li>
                    </Show>

                    <For
                      each={data
                        ?.game()
                        ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'platforms')[0]
                        ?.value?.split(';')
                        .filter((platform) => platform !== PLATFORMS.BROWSER)}
                    >
                      {(platform) => (
                        <li
                          classList={{
                            'text-3xl': platform === PLATFORMS.MACOS,
                            //@ts-ignore
                            'text-base': ![PLATFORMS.MACOS].includes(platform),
                          }}
                        >
                          {DICTIONNARIES_ICONS_PLATFORMS[platform]}
                          <span class="sr-only">{platform}</span>
                        </li>
                      )}
                    </For>
                  </ul>

                  <ul class="mt-4 text-xs space-y-1.5">
                    <Show
                      when={
                        data
                          ?.game()
                          ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'website')[0]
                          ?.value
                      }
                    >
                      <li>
                        <a
                          class="text-brand-pink font-medium hover:text-opacity-80 flex items-center"
                          href={
                            data
                              ?.game()
                              ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'website')[0]
                              ?.value
                          }
                          target="_blank"
                        >
                          <IconWebsite class="mie-1ex" />
                          Website
                        </a>
                      </li>
                    </Show>
                    <Show
                      when={
                        data
                          ?.game()
                          ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'steamUrl')[0]
                          ?.value
                      }
                    >
                      <li>
                        <a
                          class="text-brand-pink font-medium hover:text-opacity-80 flex items-center"
                          href={
                            data
                              ?.game()
                              ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'steamUrl')[0]
                              ?.value
                          }
                          target="_blank"
                        >
                          <IconSteam class="mie-1ex" />
                          Steam page
                        </a>
                      </li>
                    </Show>

                    <Show
                      when={
                        data
                          ?.game()
                          ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'itchUrl')[0]
                          ?.value
                      }
                    >
                      <li>
                        <a
                          class="text-brand-pink font-medium hover:text-opacity-80 flex items-center"
                          href={
                            data
                              ?.game()
                              ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'itchUrl')[0]
                              ?.value
                          }
                          target="_blank"
                        >
                          <IconItchIo class="mie-1ex" />
                          itch.io page
                        </a>
                      </li>
                    </Show>

                    <Show
                      when={
                        data
                          ?.game()
                          ?.data.publication?.metadata.attributes.filter(
                            (attr) => attr.traitType === 'googlePlayUrl',
                          )[0]?.value
                      }
                    >
                      <li>
                        <a
                          class="text-brand-pink font-medium hover:text-opacity-80 flex items-center"
                          href={
                            data
                              ?.game()
                              ?.data.publication?.metadata.attributes.filter(
                                (attr) => attr.traitType === 'googlePlayUrl',
                              )[0]?.value
                          }
                          target="_blank"
                        >
                          <IconGooglePlay class="mie-1ex" />
                          Google Play page
                        </a>
                      </li>
                    </Show>

                    <Show
                      when={
                        data
                          ?.game()
                          ?.data.publication?.metadata.attributes.filter(
                            (attr) => attr.traitType === 'appleAppStoreUrl',
                          )[0]?.value
                      }
                    >
                      <li>
                        <a
                          class="text-brand-pink font-medium hover:text-opacity-80 flex items-center"
                          href={
                            data
                              ?.game()
                              ?.data.publication?.metadata.attributes.filter(
                                (attr) => attr.traitType === 'appleAppStoreUrl',
                              )[0]?.value
                          }
                          target="_blank"
                        >
                          <IconPlatformMacOS class="mie-1ex" />
                          App store page
                        </a>
                      </li>
                    </Show>
                  </ul>

                  <ul class="italic text-neutral-400 mt-5 text-2xs space-y-1.5">
                    <For
                      each={data
                        ?.game()
                        ?.data.publication?.metadata.attributes.filter((attr) => attr.traitType === 'genres')[0]
                        ?.value?.split(';')}
                    >
                      {(genre) => <li>{genre}</li>}
                    </For>
                  </ul>
                </div>
                <div class="py-5">
                  <ListGamePass profileId={data?.game()?.data.publication?.profile?.id} />
                </div>
              </div>
              <div class="md:w-2/3 animate-appear">
                <section>
                  <ul class="grid grid-cols-3 xs:grid-cols-4 gap-4">
                    <For
                      each={data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                        ?.value.split(';')
                        .slice(0, 6)}
                    >
                      {(media, key) => (
                        <li class="col-span-1">
                          <button
                            onClick={() => {
                              setInitialSlide(key())
                              apiDialogModalScreenshots().open()
                            }}
                            style={{
                              'background-image': `url(${media})`,
                            }}
                            class="relative rounded-md overflow-hidden w-full aspect-game-thumbnail border border-[rgb(30,30,30)] focus:border-[rgb(45,45,45)]"
                          >
                            <span class="bg-white bg-opacity-10 animate-pulse block absolute top-0 left-0 w-full h-full" />
                            <span
                              style={{
                                'background-image': `url(${media})`,
                                'background-size': 'cover',
                              }}
                              class="bg-cover bg-no-repeat bg-center hover:scale-105 focus:scale-105 transition-all relative z-10 w-full h-full block"
                            />
                          </button>
                        </li>
                      )}
                    </For>
                    <Show
                      when={
                        data
                          ?.game()
                          ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                          ?.value.split(';').length > 6
                      }
                    >
                      <li class="col-span-1">
                        <button
                          onClick={() => {
                            setInitialSlide(6)
                            apiDialogModalScreenshots().open()
                          }}
                          class="text-2xs text-neutral-400 hover:text-neutral-300 focus:text-white border border-white border-opacity-10 focus:border-opacity-20 bg-white bg-opacity-2.5 rounded-md overflow-hidden w-full aspect-game-thumbnail"
                        >
                          Show{' '}
                          {data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                            ?.value.split(';').length - 6}{' '}
                          more
                        </button>
                      </li>
                    </Show>
                  </ul>
                </section>
                <section class="py-6 md:y-12">
                  <GameDescription
                    content={
                      data
                        ?.game()
                        ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'description')[0]
                        ?.value
                    }
                  />
                </section>
                <section class="prose prose-invert py-6 border-t border-white border-opacity-10">
                  <h2 class="text-sm text-neutral-300">Minimum system requirements</h2>
                  <ul>
                    <li>
                      <span>CPU:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsCpu',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsCpu',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>GPU:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsGpu',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsGpu',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>OS:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsOs',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsOs',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>RAM:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsRam',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsRam',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>Storage:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsStorage',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsStorage',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>Additional notes:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'minimumSystemRequirementsAdditionalNote',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'minimumSystemRequirementsAdditionalNote',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                  </ul>
                </section>
                <section class="prose prose-invert py-6 border-t border-white border-opacity-10">
                  <h2 class="text-sm text-neutral-300">Recommended system requirements</h2>
                  <ul>
                    <li>
                      <span>CPU:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsCpu',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsCpu',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>GPU:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsGpu',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsGpu',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>OS:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsOs',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsOs',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>RAM:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsRam',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsRam',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>Storage:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsStorage',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsStorage',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                    <li>
                      <span>Additional notes:</span>{' '}
                      <Show
                        when={
                          data
                            ?.game()
                            ?.data?.publication?.metadata?.attributes.filter(
                              (attr) => attr.traitType === 'recommendedSystemRequirementsAdditionalNote',
                            )[0]?.value
                        }
                      >
                        <span>
                          {
                            data
                              ?.game()
                              ?.data?.publication?.metadata?.attributes.filter(
                                (attr) => attr.traitType === 'recommendedSystemRequirementsAdditionalNote',
                              )[0]?.value
                          }
                        </span>
                      </Show>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
            {apiDialogModalScreenshots().isOpen && (
              <Portal>
                <DialogSliderScreenshots
                  api={apiDialogModalScreenshots}
                  initialSlide={initialSlide}
                  images={data
                    ?.game()
                    ?.data?.publication?.metadata?.attributes.filter((attr) => attr.traitType === 'medias')[0]
                    ?.value.split(';')}
                />
              </Portal>
            )}
          </Match>
        </Switch>
      </Suspense>
    </>
  )
}
