import { createEffect, Match, Show, Switch } from 'solid-js'
import useBalance from '@hooks/useBalance'
import { IconChevronDown, IconErrorCircleOutline } from '@components/Icons'
import { getTokenData, tokens } from '@helpers/tokens'

export const InputToken = (props) => {
  const { balanceState } = useBalance()

  return (
    <>
      {' '}
      <div
        class="flex border border-solid text-sm rounded-md"
        classList={{
          'bg-white bg-opacity-3.5 focus:bg-opacity-7.5 border-white border-opacity-15 hover:border-opacity-25 focus-within:border-opacity-25':
            (props.hasErrors === false && props.amountValid() === true) || props.disabled === false,
          'input-error-border': props.hasErrors === true && props.disabled === false,
          'opacity-50 cursor-not-allowed': props.disabled === true,
        }}
      >
        <button
          class="border-ie border-white border-opacity-15 cursor-pointer py-1 pis-2 pie-1 rounded-is-md flex justify-center w-full max-w-fit-content items-center font-medium"
          classList={{
            'cursor-not-allowed': props.disabled === true,
          }}
          disabled={props.showUserBalance === true && (balanceState.loading === true || props.disabled)}
          aria-disabled={props.showUserBalance === true && (balanceState.loading === true || props.disabled)}
          {...props.api().triggerProps}
        >
          <Switch>
            <Match when={!props?.pickedTokenAddress}>
              <div class="uppercase text-3xs">Pick token</div>
            </Match>
            <Match when={props?.pickedTokenAddress}>
              <div class="text-2xs flex">
                <img src={getTokenData(props.pickedTokenAddress).logo} alt="" width="20" height="20" />
                <span class="pis-1ex">{getTokenData(props.pickedTokenAddress).symbol}</span>
              </div>
            </Match>
          </Switch>
          <IconChevronDown />
        </button>
        <input
          value={props.value}
          aria-disabled={
            props.showUserBalance === true &&
            (balanceState.loading === true ||
              !balanceState.balanceOf[props?.pickedTokenAddress]?.symbol ||
              props.disabled)
          }
          disabled={
            props.showUserBalance === true &&
            (balanceState.loading === true ||
              !balanceState.balanceOf[props?.pickedTokenAddress]?.symbol ||
              props.disabled)
          }
          aria-invalid={props.hasErrors === true}
          class="w-full border-solid px-2 py-1 input-report-error rounded-ie-[inherit]"
          classList={{
            'border-opacity-20 hover:border-opacity-25 focus:border-opacity-40 placeholder:text-white bg-white text-white border-white bg-opacity-3.5 focus:bg-opacity-5':
              props.hasErrors === false && props.amountValid() === true,
            'input-error-bg': (props.hasErrors === true || props.amountValid() === false) && props.disabled === false,
            'pointer-events-none': props.disabled === true,
          }}
          placeholder=""
          required
          id="amount"
          type="number"
          min="0"
          step="0.0001"
          max={props.max}
          oninput={(e) => {
            //@ts-ignore
            e.target.validity.valid === true ? props.setAmountValid(true) : props.setAmountValid(false)
            //@ts-ignore
            props.onAmountChange(e.target.value)
          }}
          onblur={(e) => {
            //@ts-ignore
            e.target.validity.valid === true ? props.setAmountValid(true) : props.setAmountValid(false)
          }}
        />
      </div>
      <div class="text-2xs pt-1 flex flex-col">
        <Show when={props.amountValid() === false && !props.disabled}>
          <div class="flex pb-1.5 items-center text-negative-400">
            <IconErrorCircleOutline class="text-negative-500 text-lg mie-1ex" />
            Please type a valid tip amount{' '}
            <Show when={props.showUserBalance}>
              (max {balanceState.balanceOf[props?.pickedTokenAddress]?.formatted}
              {balanceState.balanceOf[props?.pickedTokenAddress]?.symbol})
            </Show>
          </div>
        </Show>
        <Show when={props.showUserBalance}>
          <div class="flex">
            <span class="text-neutral-400 text-2xs pie-1ex">Available balance:</span>{' '}
            <span class="flex overflow-hidden max-w-[8ex]">
              {balanceState.balanceOf[props?.pickedTokenAddress]?.formatted}
            </span>
            <span class="pis-[0.5ex]">{balanceState.balanceOf[props?.pickedTokenAddress]?.symbol}</span>
          </div>
        </Show>
      </div>
    </>
  )
}

export default InputToken
