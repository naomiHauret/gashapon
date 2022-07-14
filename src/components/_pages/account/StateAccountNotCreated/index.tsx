import FormCreateAccount from '../FormCreateAccount'

export const StateAccountNotCreated = () => {
  return (
    <div class="animate-appear w-full md:max-w-3/4">
      <p class="font-semibold text-md mb-3">
        Before creating your account, you'll need to claim your{' '}
        <a href="https://lens.xyz" target="_blank" rel="nofollow noreferrer">
          Lens
        </a>{' '}
        profile handle first.
      </p>
      <p class="text-neutral-500 italic">
        You will be able to re-use the data attached to your account handle on other apps that use Lens protocol. Pretty
        cool huh?
      </p>
      <div class="w-full max-w-screen-xs mt-6">
        <FormCreateAccount />
      </div>
    </div>
  )
}

export default StateAccountNotCreated
