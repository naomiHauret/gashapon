import { RadioGroup, RadioGroupDescription } from 'solid-headless'
import { For } from 'solid-js'
import { tokens } from '@helpers/tokens'
import OptionToken from '@components/DialogPickToken/OptionToken'
import useBalance from '@hooks/useBalance'
import useNetwork from '@hooks/useNetwork'
import FormInput from '@components/FormInput'
import Button from '@components/Button'

export const FormSendTip = (props) => {
  const { balanceState } = useBalance()
  const { networkData } = useNetwork()

  return (
    <form>
      <fieldset>
        <legend class="font-bold">1. Pick a token</legend>
        <RadioGroup
          class="space-y-2"
          onChange={(e) => {
            // console.log(e)
          }}
        >
          {({ isSelected, isActive }) => (
            <>
              <RadioGroupDescription class="sr-only">Whitelisted tokens</RadioGroupDescription>
              <For each={Object.keys(tokens[networkData()?.chain?.id])}>
                {(tokenName) => (
                  <>
                    <OptionToken
                      showUserBalance={true}
                      formatted={balanceState.balanceOf[tokens[networkData()?.chain?.id][tokenName]]?.formatted}
                      tokenName={tokenName}
                      value={tokens[networkData()?.chain?.id][tokenName]}
                      logo={tokens.logos[tokenName]}
                    />
                  </>
                )}
              </For>
            </>
          )}
        </RadioGroup>

        <div class="mt-4">
          <label class="flex flex-col" for="input-token-tip-custom">
            <span class="pb-1 font-medium text-neutral-400 text-2xs">use a custom token instead:</span>
            <FormInput class="w-full" name="input-token-tip-custom" />
          </label>
        </div>
      </fieldset>
      <fieldset class="mt-6">
        <legend class="font-bold mb-2">2. Type amount</legend>
        <label>
          <FormInput type="number" step="0.000001" />
        </label>
      </fieldset>
      <Button class="mt-6">Send tip</Button>
    </form>
  )
}

export default FormSendTip
