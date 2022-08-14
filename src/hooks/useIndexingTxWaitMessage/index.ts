import { createEffect, createSignal } from 'solid-js'

export function useIndexingTxWaitMessage() {
  const [showWaitMessage, setShowWaitMessage] = createSignal(false)
  const [canStartCountdown, setCanStartCountdown] = createSignal(false)

  createEffect(() => {
    if (canStartCountdown() === true) {
      setTimeout(() => {
        if (canStartCountdown()) setShowWaitMessage(true)
      }, 10000)
    }
  })

  return {
    showWaitMessage,
    setCanStartCountdown,
    setShowWaitMessage,
  }
}

export default useIndexingTxWaitMessage
