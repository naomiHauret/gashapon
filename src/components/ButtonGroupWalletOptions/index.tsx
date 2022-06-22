import { For } from 'solid-js'
import useConnect from '@hooks/useConnect'
import Button from '@components/Button'
import useVerifyUser from '@hooks/useVerifyUser'

export const ButtonGroupWalletOptions = () => {
  const { connect, connectors } = useConnect()
  const { walletVerifiedState, dialogApi, dialogRef } = useVerifyUser()

  return (
    <>
      <For each={connectors}>
        {(connector) => (
          <>
            <Button
              ref={dialogRef}
              {...dialogApi().triggerProps}
              /* @ts-expect-error */
              intent={`wallet-${connector.name}`}
              aspect="outline-default"
              class={`${
                walletVerifiedState.loading === true ?? 'animate-pulse'
              } w-full flex items-center justify-center`}
              /* @ts-ignore */
              disabled={connector.ready === false || walletVerifiedState.loading === true}
              onClick={() => {
                connect(connector)
                dialogApi().open()
              }}
              isLoading={walletVerifiedState.loading === true}
            >
              {/* @ts-ignore */}
              {connector?.name}{' '}
            </Button>
          </>
        )}
      </For>
    </>
  )
}

export default ButtonGroupWalletOptions
