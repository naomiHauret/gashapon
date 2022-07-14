import { Switch, Match, Show } from 'solid-js'
import { RadioGroupLabel, RadioGroupOption } from 'solid-headless'
import { IconSpinner } from '../Icons'

export const OptionToken = (props) => {
  return (
    <RadioGroupOption
      disabled={props.showUserBalance === true && (!props?.formatted || parseFloat(props?.formatted) === 0)}
      value={props.value}
    >
      {({ isSelected: checked }) => (
        <>
          <RadioGroupLabel
            class="p-3 rounded-md border border-white border-opacity-15 flex items-center cursor-pointer"
            classList={{
              'text-white hover:bg-white hover:bg-opacity-5':
                !checked() || (!props?.formatted && parseFloat(props?.formatted) === 0),
              'border-opacity-0 bg-brand-pink hover:bg-opacity-25 border-transparent text-black hover:text-brand-pink':
                checked(),
              'opacity-25 hover:bg-transparent':
                props.showUserBalance === true && (!props?.formatted || parseFloat(props?.formatted) === 0),
            }}
          >
            <img src={props.logo} alt="" width="25" height="25" loading="lazy" />
            <span class="pis-2 font-semibold">{props.tokenName}</span>
            <Show when={props.showUserBalance === true}>
              <Switch>
                <Match when={props.formatted}>
                  <p class="overflow-hidden pis-[5ex] text-ellipsis mis-auto font-medium font-mono animate-appear">
                    {((props.formatted * 100) / 100).toFixed(4)}
                  </p>
                </Match>
                <Match when={!props?.formatted}>
                  <IconSpinner class="animate-spin mis-auto" />
                </Match>
              </Switch>
            </Show>
          </RadioGroupLabel>
        </>
      )}
    </RadioGroupOption>
  )
}

export default OptionToken
