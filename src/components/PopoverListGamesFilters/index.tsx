import input from '@components/FormInput/styles'
import * as accordion from '@zag-js/accordion'
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createSignal, createUniqueId, For, Show } from 'solid-js'

export const PopoverListGamesFilters = (props) => {
  const [totalFiltersApplied, setTotalFiltersApplied] = createSignal(
    props.numberAppliedFiltersPlatforms + props.numberAppliedFiltersGenres + props.numberAppliedFiltersTags,
  )

  const [statePopover, sendPopover] = useMachine(popover.machine({ id: createUniqueId(), closeOnBlur: false }))
  const apiPopover = createMemo(() => popover.connect(statePopover, sendPopover, normalizeProps))

  const [stateAccordion, sendAccordion] = useMachine(
    accordion.machine({
      id: createUniqueId(),
      multiple: true,
    }),
  )

  const apiAccordion = createMemo(() => accordion.connect(stateAccordion, sendAccordion, normalizeProps))

  createEffect(() => {
    setTotalFiltersApplied(
      props.numberAppliedFiltersPlatforms + props.numberAppliedFiltersGenres + props.numberAppliedFiltersTags,
    )
  })
  return (
    <div class="relative z-20 w-full">
      <button type="button" class={input({ class: 'font-bold w-full' })} {...apiPopover().triggerProps}>
        Filters <Show when={totalFiltersApplied() > 0}>({totalFiltersApplied()})</Show>
      </button>
      <div class="z-20" {...apiPopover().positionerProps}>
        <div
          class="overflow-y-auto max-w-screen-min rounded-md bg-black w-full border border-solid border-white border-opacity-10"
          {...apiPopover().contentProps}
        >
          <div class="divide-y divide-solid divide-white divide-opacity-20" {...apiAccordion().rootProps}>
            <Show when={props.platformsOptions?.length > 1}>
              <div {...apiAccordion().getItemProps({ value: 'Platforms' })}>
                <button
                  type="button"
                  class="text-start uppercase text-white text-opacity-50 text-2xs font-bold tracking-wide bg-neutral-500 bg-opacity-10 w-full px-4 py-2"
                  {...apiAccordion().getTriggerProps({ value: 'Platforms' })}
                >
                  Platforms{' '}
                  <Show when={props.numberAppliedFiltersPlatforms > 0}>
                    {' '}
                    <span>({props.numberAppliedFiltersPlatforms})</span>
                  </Show>
                </button>
                <div
                  class="px-4 py-2 flex flex-col space-y-3"
                  {...apiAccordion().getContentProps({ value: 'Platforms' })}
                >
                  <For each={props.platformsOptions}>
                    {(platform) => (
                      <label class="relative z-10 flex items-center">
                        <input
                          name="platforms[]"
                          class="scale-125 inline-flex mie-1ex"
                          value={`${platform}`}
                          type="checkbox"
                        />
                        {platform}
                      </label>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <Show when={props.genresOptions?.length > 1}>
              <div {...apiAccordion().getItemProps({ value: 'Genres' })}>
                <button
                  type="button"
                  class="text-start uppercase text-white text-opacity-50 text-2xs font-bold tracking-wide bg-neutral-500 bg-opacity-10 w-full px-4 py-2"
                  {...apiAccordion().getTriggerProps({ value: 'Genres' })}
                >
                  Genres{' '}
                  <Show when={props.numberAppliedFiltersGenres > 0}>
                    {' '}
                    <span>({props.numberAppliedFiltersGenres})</span>
                  </Show>
                </button>
                <div class="px-4 py-2 flex flex-col space-y-3" {...apiAccordion().getContentProps({ value: 'Genres' })}>
                  <For each={props.genresOptions}>
                    {(genre) => (
                      <label class="relative z-10 flex items-center">
                        <input
                          class="scale-125 inline-flex mie-1ex"
                          value={`${genre}`}
                          type="checkbox"
                          name="genres[]"
                        />
                        {genre}
                      </label>
                    )}
                  </For>
                </div>
              </div>
            </Show>
            <Show when={props.tagsOptions?.length > 1}>
              <div {...apiAccordion().getItemProps({ value: 'Tags' })}>
                <button
                  type="button"
                  class="text-start uppercase text-white text-opacity-50 text-2xs font-bold tracking-wide bg-neutral-500 bg-opacity-10 w-full px-4 py-2"
                  {...apiAccordion().getTriggerProps({ value: 'Tags' })}
                >
                  Tags{' '}
                  <Show when={props.numberAppliedFiltersTags > 0}>
                    {' '}
                    <span>({props.numberAppliedFiltersTags})</span>
                  </Show>
                </button>
                <div class="px-4 py-2 flex flex-col space-y-3" {...apiAccordion().getContentProps({ value: 'Tags' })}>
                  <For each={props.tagsOptions}>
                    {(tag) => (
                      <label class="relative z-10 flex items-center">
                        <input class="scale-125 inline-flex mie-1ex" value={`${tag}`} type="checkbox" name="tags[]" />
                        {tag}
                      </label>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopoverListGamesFilters
