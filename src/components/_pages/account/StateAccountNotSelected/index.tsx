import FormSelectDefaultAccount from '../FormSelectDefaultAccount'

export const StateAccountNotSelected = () => {
  return (
    <>
      <p class="font-semibold text-md mb-3">Pick your default account.</p>
      <p class="text-neutral-500 italic">Select the default account you want to use on Gashapon.</p>
      <p class="text-neutral-500 italic">Don't worry, you can change your default account whenever you want.</p>
      <div class="w-full max-w-screen-xs mt-6">
        <FormSelectDefaultAccount />
      </div>
    </>
  )
}

export default StateAccountNotSelected
