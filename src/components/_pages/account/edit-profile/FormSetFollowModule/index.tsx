import { createSignal, createMemo, Show } from 'solid-js'
import * as dialog from '@zag-js/dialog'
import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import Button from '@components/Button'
import Callout from '@components/Callout'
import { FOLLOW_MODULE_TYPES, useSetFollowModule } from './useSetFollowModule'
import { Portal } from 'solid-js/web'
import DialogPickToken from '@components/DialogPickToken'
import useNetwork from '@hooks/useNetwork'
import InputToken from '@components/InputToken'
import { whitelist } from '@helpers/tokens'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from 'solid-headless'

export const FormSetFollowModule = () => {
  const { storeForm, stateSetFollowModule, showWaitMessage } = useSetFollowModule()
  const { networkData } = useNetwork()
  const { form } = storeForm
  const [stateDialogPickToken, sendDialogPickToken] = useMachine(dialog.machine)
  const refDialogPickToken = useSetup({ send: sendDialogPickToken, id: 'dialog-pick-token-follow-module' })
  const apiDialogPickToken = createMemo(() => dialog.connect(stateDialogPickToken, sendDialogPickToken, normalizeProps))
  const [amountValid, setAmountValid] = createSignal(true)

  function resetFeeInputs() {
    if (storeForm?.data()?.type !== FOLLOW_MODULE_TYPES.FEE) {
      storeForm.setData('feeCurrencyAddress', '')
      storeForm.setData('feeAmount', '')
    }
  }

  return (
    <>
      <Show when={stateSetFollowModule.isLoading && showWaitMessage() === true}>
        <Callout class="mb-6 animate-appear">
          Looks like indexing the changes of your follow settings is taking a bit of time, please wait a bit more or
          reload the page.
        </Callout>
      </Show>
      {/* @ts-ignore */}
      <form use:form class="w-full">
        <RadioGroup
          value={storeForm.data().type}
          onChange={(value) => {
            if (value !== FOLLOW_MODULE_TYPES.FEE) resetFeeInputs()
            storeForm.setData('type', value)
          }}
        >
          {({ isSelected, isActive }) => (
            <>
              <RadioGroupLabel class="sr-only">Follow settings</RadioGroupLabel>
              <div class="space-y-4">
                <RadioGroupOption class="radio-pseudoIndicator" value={FOLLOW_MODULE_TYPES.FREE}>
                  {({ isSelected: checked }) => (
                    <>
                      <span class="font-bold">Free</span> - Anyone can follow you, for free.
                    </>
                  )}
                </RadioGroupOption>
                <RadioGroupOption class="radio-pseudoIndicator" value={FOLLOW_MODULE_TYPES.REVERT}>
                  {({ isSelected: checked }) => (
                    <>
                      <span class="font-bold">No followers</span> - No one can follow you.
                    </>
                  )}
                </RadioGroupOption>
                <RadioGroupOption class="radio-pseudoIndicator" value={FOLLOW_MODULE_TYPES.PROFILE}>
                  {({ isSelected: checked }) => (
                    <>
                      <span class="font-bold">Profiles only</span> - Only people with a profile can follow you.
                    </>
                  )}
                </RadioGroupOption>
                <RadioGroupOption class="radio-pseudoIndicator" value={FOLLOW_MODULE_TYPES.FEE}>
                  {({ isSelected: checked }) => (
                    <>
                      <span class="font-bold">Charge a fee</span> - Charge a fee to allow people to follow you.
                    </>
                  )}
                </RadioGroupOption>
              </div>
            </>
          )}
        </RadioGroup>
        <div class="pis-5 mt-2.5 xs:max-w-fit-content">
          <InputToken
            api={apiDialogPickToken}
            ref={refDialogPickToken}
            amountValid={amountValid}
            setAmountValid={setAmountValid}
            hasErrors={storeForm.data()?.type === FOLLOW_MODULE_TYPES.FEE && storeForm.errors().amount?.length > 0}
            pickedTokenAddress={storeForm.data()?.feeCurrencyAddress}
            disabled={storeForm.data()?.type !== FOLLOW_MODULE_TYPES.FEE}
            onAmountChange={(value) => storeForm.setData('feeAmount', parseFloat(value))}
            showUserBalance={false}
            value={storeForm.data()?.feeAmount}
            tokens={whitelist[networkData().chain.id]}
          />
        </div>

        <Button
          class="w-full xs:w-auto mt-8"
          disabled={stateSetFollowModule.isLoading || !storeForm.isValid()}
          isLoading={stateSetFollowModule.isLoading}
        >
          <Show when={stateSetFollowModule.isError === false && !stateSetFollowModule.isLoading}>
            Change your settings
          </Show>
          <Show when={stateSetFollowModule.isLoading}>Changing your settings...</Show>
          <Show when={stateSetFollowModule.isError === true}>Try again</Show>
        </Button>
      </form>
      {apiDialogPickToken().isOpen && (
        <Portal>
          <DialogPickToken
            showUserBalance={false}
            tokens={whitelist[networkData().chain.id]}
            pickedToken={storeForm.data().feeCurrencyAddress}
            api={apiDialogPickToken}
            onRadioChange={(value) => {
              storeForm.setData('feeCurrencyAddress', value)
              apiDialogPickToken().close()
            }}
          />
        </Portal>
      )}
    </>
  )
}

export default FormSetFollowModule
