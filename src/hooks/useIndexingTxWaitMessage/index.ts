import { createEffect, createSignal } from 'solid-js'

export function useIndexingTxWaitMessage(_state) {
  const [showWaitMessage, setShowWaitMessage] = createSignal(false)
  createEffect(() => {
    if (_state.isLoading) {
      setTimeout(() => {
        if (_state.isLoading) setShowWaitMessage(true)
      }, 10000)
    }
  })
  return showWaitMessage
}

export default useIndexingTxWaitMessage
