import { useMachine, useSetup, normalizeProps } from '@zag-js/solid'
import * as toast from '@zag-js/toast'
import { createContext, createUniqueId, For, useContext, createMemo } from 'solid-js'
import Toast from '@components/Toast'
import { Portal } from 'solid-js/web'
import type { PropTypes } from '@zag-js/solid'

const ContextToast = createContext()

export const ProviderToast = (props) => {
  const id = createUniqueId()
  const [state, send] = useMachine(
    toast.group.machine({
      offsets: {
        top: '1rem',
        right: '1rem',
        bottom: '1rem',
        left: '1rem',
      },
    }),
  )
  const ref = useSetup({ send, id })
  const api = createMemo(() => toast.group.connect<PropTypes>(state, send, normalizeProps))

  return (
    <ContextToast.Provider value={api}>
      {props.children}
      <Portal>
        <div
          ref={ref}
          {...api().getGroupProps({ placement: 'bottom' })}
          class="toast-group relative z-50 flex flex-col items-center justify-center"
        >
          <For each={api().toasts}>{(toast) => <Toast toast={toast} />}</For>
        </div>
      </Portal>
    </ContextToast.Provider>
  )
}

export function useToast() {
  return useContext(ContextToast)
}

export default useToast
