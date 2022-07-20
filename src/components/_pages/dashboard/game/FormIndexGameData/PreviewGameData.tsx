import { For, Match, Show, Switch } from 'solid-js'
import { DICTIONNARIES_ICONS_PLATFORMS } from '@components/Icons'
import { PLATFORMS } from '@helpers/gamePlatforms'
import STATUS, {
  ABANDONWARE_STABLE,
  ABANDONWARE_UNSTABLE,
  COMPLETE,
  EARLY,
  END_OF_LIFE,
  IN_DEVELOPMENT,
  STABLE,
} from '@helpers/gameDevelopmentStages'
import PRODUCTION_TYPES from '@helpers/gameTypes'
import generateLightColor from '@helpers/generateRandomLightColor'

export const PreviewGameData = (props) => {
  return (
    <>
      <div class="border boder-solid border-white border-opacity-20 overflow-hidden rounded-md">
        <div class="mx-auto bg-white bg-opacity-10 w-full overflow-hidden aspect-game-thumbnail relative">
          <p
            classList={{
              'flair-game-status--not-ready': [STATUS[IN_DEVELOPMENT].value, STATUS[EARLY].value].includes(
                props.storeForm.data()?.status,
              ),
              'flair-game-status--stable': [STATUS[STABLE].value, STATUS[COMPLETE].value].includes(
                props.storeForm.data()?.status,
              ),
              'flair-game-status--stable-eol': [STATUS[END_OF_LIFE].value, STATUS[ABANDONWARE_STABLE].value].includes(
                props.storeForm.data()?.status,
              ),
              'flair-game-status--abandonware-unstable': [STATUS[ABANDONWARE_UNSTABLE].value].includes(
                props.storeForm.data()?.status,
              ),
              'flair-game-status--undefined': !props.storeForm.data()?.status || props.storeForm.data()?.status === '',
            }}
            class="absolute top-2 inline-start-2 z-10 flair-game-status"
          >
            <Switch>
              <Match when={!props.storeForm.data()?.status || props.storeForm.data()?.status === ''}>
                [ Game status ]
              </Match>
              <Match when={props.storeForm.data()?.status && props.storeForm.data()?.status !== ''}>
                {STATUS[props.storeForm.data()?.status].label}
              </Match>
            </Switch>
          </p>
          <Show when={props.gameThumbnailSrc() && props.gameThumbnailSrc() !== null}>
            <img class="w-full h-full object-cover absolute top-0 left-0" src={props.gameThumbnailSrc()} />
          </Show>
        </div>
        <div>
          <div class="px-4 pb-5 pt-3">
            <p class="text-sm font-bold mt-1.5 mb-1">
              {props.storeForm.data().title !== '' ? props.storeForm.data().title : <>[ Game title]</>}
            </p>
            <p class="text-xs italic text-neutral-500 mb-2">
              {props.storeForm.data().developmentTeam !== '' ? (
                `by ${props.storeForm.data().developmentTeam}`
              ) : (
                <>[ Team name]</>
              )}
            </p>
            <p class="text-xs mb-4">
              {props.storeForm.data().tagline !== '' ? (
                props.storeForm.data().tagline
              ) : (
                <>[ A few lines about your game]</>
              )}
            </p>
            <Switch>
              <Match when={!props.storeForm.data()?.genres || props.storeForm.data().genres?.length === 0}>
                <span class="block pb-0.5 text-neutral-400">[ Game genres ]</span>
              </Match>
              <Match when={props.storeForm.data()?.genres?.length > 0}>
                <For each={props.storeForm.data().genres}>
                  {/* @ts-ignore */}
                  {(genre) => <span class="block pb-0.5 text-neutral-400">{genre}</span>}
                </For>
              </Match>
            </Switch>
            <Switch>
              <Match when={!props.storeForm.data().platforms}>
                <p class="mt-3">[ Platforms ]</p>
              </Match>
              <Match when={props.storeForm.data().platforms?.length > 0}>
                <div
                  classList={{
                    'mb-3':
                      props.storeForm.data().platforms?.length > 1 &&
                      props.storeForm.data().platforms.includes(PLATFORMS.BROWSER),
                    'mt-3': props.storeForm.data().platforms?.length >= 1,
                  }}
                  class="flex space-i-4 text-neutral-200 items-center"
                >
                  <For each={props.storeForm.data().platforms}>
                    {(platform) => (
                      <Show when={platform !== PLATFORMS.BROWSER}>
                        <span
                          classList={{
                            'text-3xl': platform === PLATFORMS.MACOS,
                            //@ts-ignore
                            'text-sm': ![PLATFORMS.MACOS, PLATFORMS.BROWSER].includes(platform),
                          }}
                        >
                          {/* @ts-ignore */}
                          {DICTIONNARIES_ICONS_PLATFORMS[platform]}
                          {/* @ts-ignore */}
                          <span class="sr-only">{platform}</span>
                        </span>
                      </Show>
                    )}
                  </For>
                </div>
                <Show when={props.storeForm.data().platforms.includes(PLATFORMS.BROWSER)}>
                  <span class="text-3xs font-semibold inline-flex rounded-md bg-neutral-600 text-white px-2 py-0.5">
                    Play in browser
                  </span>
                </Show>
              </Match>
            </Switch>
          </div>
          <div class="border-t px-4 py-3 border-white border-opacity-20">
            <Switch>
              <Match when={!props.storeForm.data()?.productionType}>
                <span class="block mb-2 text-2xs text-white font-bold">[ Production type ]</span>
              </Match>
              <Match when={props.storeForm.data()?.productionType}>
                <span class="block mb-2 text-2xs text-white font-bold">
                  {PRODUCTION_TYPES[props.storeForm.data()?.productionType].label}
                </span>
              </Match>
            </Switch>

            <Switch>
              <Match when={!props.storeForm.data()?.tags || props.storeForm.data().tags?.length === 0}>
                <span class="block pb-0.5 text-neutral-400">[ Game tags ]</span>
              </Match>
              <Match when={props.storeForm.data()?.tags?.length > 0}>
                <div class="flex flex-wrap">
                  <For each={props.storeForm.data().tags}>
                    {(tag) => (
                      <span
                        style={{
                          'background-color': `${generateLightColor()}`,
                        }}
                        class="text-2xs font-semibold inline-flex rounded-md text-black px-2 py-0.5 border-2 border-solid border-black"
                      >
                        {/* @ts-ignore */}
                        {tag}
                      </span>
                    )}
                  </For>
                </div>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreviewGameData
