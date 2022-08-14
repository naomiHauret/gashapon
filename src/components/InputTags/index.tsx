import { For } from 'solid-js'
import { input } from '@components/FormInput/styles'

export const InputTags = (props) => {
  return (
    <>
      <div
        class={input({
          intent: props.intent,
          scale: props.scale,
          class: `flex items-baseline flex-wrap ${props.class ?? ''}`,
        })}
        {...props.api().rootProps}
      >
        <For each={props.api().value}>
          {(value, index) => (
            <span class="input-tags_tag">
              <div {...props.api().getTagProps({ index: index(), value })}>
                <span>{value} </span>
                <button class="mis-1" {...props.api().getTagDeleteButtonProps({ index: index(), value })}>
                  &#x2715;
                </button>
              </div>
              <input {...props.api().getTagInputProps({ index: index(), value })} />
            </span>
          )}
        </For>
        <input
          class="flex-grow bg-transparent focus:outline-none placeholder:text-opacity-30"
          placeholder={props.placeholder}
          {...props.api().inputProps}
        />
      </div>
      <button type="button" class="text-2xs mt-1 text-neutral-500 px-3" onClick={() => props.api().clearAll()}>
        Clear all tags
      </button>
    </>
  )
}

export default InputTags
