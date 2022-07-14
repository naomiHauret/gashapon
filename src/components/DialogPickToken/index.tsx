import { RadioGroup } from 'solid-headless'
import { For } from 'solid-js'
import { tokens } from '@helpers/tokens'
import OptionToken from './OptionToken'
import DialogModal from '@components/DialogModal'
import useBalance from '@hooks/useBalance'

export const DialogPickToken = (props) => {
  const { balanceState } = useBalance()
  return (
    <DialogModal api={props.api} title="Select a token" description="Select a token from the list.">
      <RadioGroup
        class="space-y-2"
        value={props.pickedToken}
        onChange={(e) => {
          props.onRadioChange(e)
        }}
      >
        {({ isSelected, isActive }) => (
          <>
            <For each={Object.keys(props.tokens)}>
              {(tokenName) => (
                <OptionToken
                  showUserBalance={props.showUserBalance}
                  formatted={balanceState.balanceOf[props.tokens[tokenName]]?.formatted}
                  tokenName={tokenName}
                  value={props.tokens[tokenName]}
                  logo={tokens.logos[tokenName]}
                />
              )}
            </For>
          </>
        )}
      </RadioGroup>
    </DialogModal>
  )
}

export default DialogPickToken
