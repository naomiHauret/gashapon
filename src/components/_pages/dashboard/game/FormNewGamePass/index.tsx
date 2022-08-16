import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import { whitelist } from '@helpers/tokens'
import useNetwork from '@hooks/useNetwork'
import { RadioGroup, RadioGroupOption } from 'solid-headless'
import { For, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import DialogTrackProgressDataIndexing from './DialogTrackProgressDataIndexing'
import useIndexGamePass from './useIndexGamePass'

export const FormNewGamePass = (props) => {
  const {
    storeForm,
    showWaitMessage,
    stateUploadNewGamePassData,
    stateIndexGamePassData,
    apiDialogModalTrackProgress,
  } = useIndexGamePass(props.game)
  const { networkData } = useNetwork()
  const { form } = storeForm

  return (
    <>
      {/* @ts-ignore */}
      <form use:form>
        <fieldset class="space-y-6">
          <FormField>
            <FormField.InputField>
              <FormField.Label>Exclusivity</FormField.Label>
              <FormField.Description id="input-followersOnly-description">
                Define who can purchase your game with this offer.
              </FormField.Description>
              <label for="followersOnly">
                <input name="followersOnly" type="checkbox" /> Only followers can purchase the game using this offer.
              </label>
            </FormField.InputField>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="isLimitedCollectAmount">Number of copies</FormField.Label>
              <FormField.Description id="input-isLimitedCollectAmount-description">
                The maximum amount of copies of your game that can be bought with this offer.
              </FormField.Description>
              <RadioGroup
                //@ts-ignore
                value={storeForm.data().isLimitedCollectAmount}
                onChange={(value) => {
                  //@ts-ignore
                  if (value === false) storeForm.setFields('collectAmountLimit', '')
                  //@ts-ignore
                  storeForm.setFields('isLimitedCollectAmount', value)
                }}
              >
                {({ isSelected, isActive }) => (
                  <>
                    <div class="space-y-4">
                      <RadioGroupOption class="radio-pseudoIndicator" value={false}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Unlimited</span> -{' '}
                            <span>every eligible buyer can buy their pass.</span>
                          </>
                        )}
                      </RadioGroupOption>
                      <RadioGroupOption class="radio-pseudoIndicator" value={true}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Limited</span> -{' '}
                            <span>there's a limited number of pass buyers can buy.</span>
                          </>
                        )}
                      </RadioGroupOption>
                    </div>
                  </>
                )}
              </RadioGroup>
              {/* @ts-ignore */}

              <Show when={storeForm.data()?.isLimitedCollectAmount}>
                <div class="pie-3 pis-8 mt-1.5 animate-appear ">
                  <label
                    class="flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                    for="collectAmountLimit"
                  >
                    <span class="text-2xs text-neutral-300">Maximum number of copies</span>
                    <FormInput placeholder="1000" scale="sm" name="collectAmountLimit" min="1" step="1" type="number" />
                  </label>
                </div>
              </Show>
            </FormField.InputField>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="limitedCollect">Flash offer</FormField.Label>
              <FormField.Description id="input-limitedCollect-description">
                Enabling this parameter will make your game pass&nbsp;
                <span class="font-bold">purchasable for 24h only.</span>
              </FormField.Description>
              <RadioGroup
                //@ts-ignore
                value={storeForm.data().isLimitedCollectDatetime}
                onChange={(value) => {
                  //@ts-ignore
                  storeForm.setFields('isLimitedCollectDatetime', value)
                }}
              >
                {({ isSelected, isActive }) => (
                  <>
                    <div class="space-y-4">
                      <RadioGroupOption class="radio-pseudoIndicator" value={false}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Regular offer </span> - buyers can purchase this pass at anytime
                            they want.
                          </>
                        )}
                      </RadioGroupOption>
                      <RadioGroupOption class="radio-pseudoIndicator" value={true}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Flash offer</span> - this game pass will be purchasable for 24h only
                          </>
                        )}
                      </RadioGroupOption>
                    </div>
                  </>
                )}
              </RadioGroup>
            </FormField.InputField>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="hasCollectFee">Price tag</FormField.Label>
              <FormField.Description id="input-hasCollectFee-description">
                Define the price of this game pass and currency in which the buyer will pay
              </FormField.Description>
              <RadioGroup
                //@ts-ignore
                value={storeForm.data().hasCollectFee}
                onChange={(value) => {
                  if (value === false) {
                    //@ts-ignore
                    storeForm.setFields('collectFeeAmount', '')
                    //@ts-ignore
                    storeForm.setFields('referralFeeAmount', '')
                    //@ts-ignore
                    storeForm.setFields('collectFeeCurrencyAddress', whitelist[networkData()?.chain?.id].USDC)

                    //@ts-ignore
                    storeForm.setFields('hasReferralFee', false)
                  }
                  //@ts-ignore
                  storeForm.setFields('hasCollectFee', value)
                }}
              >
                {({ isSelected, isActive }) => (
                  <>
                    <div class="space-y-4">
                      <RadioGroupOption class="radio-pseudoIndicator" value={false}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Free</span> - Buyers don't need to pay anything to purchase this
                            game pass.
                          </>
                        )}
                      </RadioGroupOption>
                      <RadioGroupOption class="radio-pseudoIndicator" value={true}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">Price tag</span>
                          </>
                        )}
                      </RadioGroupOption>
                    </div>
                  </>
                )}
              </RadioGroup>
              {/* @ts-ignore */}
              <Show when={storeForm.data()?.hasCollectFee}>
                <div class="px-8 mt-1.5 space-y-3 animate-appear ">
                  <label
                    class="flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                    for="collectFeeCurrencyAddress"
                  >
                    <span class="text-2xs text-neutral-300">Currency</span>
                    <div>
                      <FormSelect
                        value={storeForm.data()?.collectFeeCurrencyAddress}
                        name="collectFeeCurrencyAddress"
                        scale="sm"
                      >
                        <option disabled value="">
                          Select currency
                        </option>
                        <For each={Object.keys(whitelist[networkData()?.chain?.id])}>
                          {(label) => <option value={whitelist[networkData()?.chain?.id][label]}>{label}</option>}
                        </For>
                      </FormSelect>
                    </div>
                  </label>

                  <label
                    class="flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                    for="collectFeeAmount"
                  >
                    <span class="text-2xs text-neutral-300">Price</span>
                    <div>
                      <FormInput scale="sm" name="collectFeeAmount" min="0" step="any" type="number" />
                    </div>
                  </label>
                </div>
              </Show>
            </FormField.InputField>
          </FormField>

          <div
            classList={{
              'opacity-75 pointer-events-none':
                //@ts-ignore
                !storeForm.data()?.hasCollectFee || !storeForm.data()?.hasCollectFee,
            }}
          >
            <FormField>
              <FormField.InputField>
                <FormField.Label for="hasReferralFee">Referral fee</FormField.Label>
                <FormField.Description id="input-hasReferralFee-description">
                  Define the % you will earn on a pass sale if the buyer sells their pass
                </FormField.Description>
                <RadioGroup
                  /* @ts-ignore */
                  disabled={!storeForm.data()?.hasCollectFee}
                  /* @ts-ignore */
                  value={storeForm.data().hasReferralFee}
                  onChange={(value) => {
                    //@ts-ignore
                    if (value === false) storeForm.setFields('referralFeeAmount', '')
                    //@ts-ignore
                    storeForm.setFields('hasReferralFee', value)
                  }}
                >
                  {({ isSelected, isActive }) => (
                    <>
                      <div class="space-y-4">
                        <RadioGroupOption
                          /* @ts-ignore */
                          disabled={!storeForm.data()?.hasCollectFee}
                          class="radio-pseudoIndicator"
                          value={false}
                        >
                          {({ isSelected: checked }) => (
                            <>
                              <span class="font-bold">None</span> - If the buyer sells their game pass, you won't earn
                              any % of the sale.
                            </>
                          )}
                        </RadioGroupOption>
                        <RadioGroupOption
                          /* @ts-ignore */
                          disabled={!storeForm.data()?.hasCollectFee}
                          class="radio-pseudoIndicator"
                          value={true}
                        >
                          {({ isSelected: checked }) => (
                            <>
                              <span class="font-bold">Charge a referral fee on sale</span>
                            </>
                          )}
                        </RadioGroupOption>
                      </div>
                    </>
                  )}
                </RadioGroup>
                {/* @ts-ignore */}

                <Show when={storeForm.data()?.hasReferralFee}>
                  <div class="px-8 mt-1.5 space-y-3 animate-appear ">
                    <label
                      class="flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                      for="referralFeeAmount"
                    >
                      <span class="text-2xs text-neutral-300">Fee amount in %</span>
                      <div>
                        <FormInput
                          /* @ts-ignore */
                          disabled={!storeForm.data()?.hasCollectFee}
                          type="number"
                          min="0"
                          step="any"
                          scale="sm"
                          name="referralFeeAmount"
                        />
                      </div>
                    </label>
                  </div>
                </Show>
              </FormField.InputField>
            </FormField>
          </div>

          <FormField>
            <FormField.InputField>
              <FormField.Label for="recipientAddress">Sales recipient address</FormField.Label>
              <FormField.Description id="input-recipientAddress-description">
                The Ethereum address that will receive all the funds (sales & referral fees)
              </FormField.Description>
              <FormInput
                placeholder="0x..."
                value={storeForm.data()?.recipientAddress}
                class="w-full xs:max-w-[55ex]"
                type="text"
                step="any"
                scale="sm"
                name="recipientAddress"
                required
              />
            </FormField.InputField>
          </FormField>
        </fieldset>
        <Button
          class="w-full xs:w-auto mt-8"
          disabled={
            stateUploadNewGamePassData.isLoading ||
            !storeForm.isValid() ||
            (storeForm.data()?.hasCollectFee === true &&
              (storeForm.data()?.collectFeeAmount === '' || storeForm.data()?.collectFeeCurrencyAddress === '')) ||
            (storeForm.data()?.isLimitedCollectAmount === true && storeForm.data()?.collectAmountLimit === '') ||
            (storeForm.data()?.hasReferralFee === true && storeForm.data()?.referralFeeAmount === '')
          }
          isLoading={stateUploadNewGamePassData.isLoading}
        >
          <Show when={stateUploadNewGamePassData.isError === false && !stateUploadNewGamePassData.isLoading}>
            Index game pass
          </Show>
          <Show when={stateUploadNewGamePassData.isLoading}>Indexing your game pass...</Show>
          <Show when={stateUploadNewGamePassData.isError === true}>Try again</Show>
        </Button>
      </form>

      {apiDialogModalTrackProgress().isOpen && (
        <Portal>
          <DialogTrackProgressDataIndexing
            api={apiDialogModalTrackProgress}
            stateUploadNewGamePassData={stateUploadNewGamePassData}
            stateIndexGamePassData={stateIndexGamePassData}
            showWaitMessage={showWaitMessage}
            game={props.game}
          />
        </Portal>
      )}
    </>
  )
}

export default FormNewGamePass
