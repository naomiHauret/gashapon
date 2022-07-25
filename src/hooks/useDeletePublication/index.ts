import { createAsyncStore } from '@hooks/useAsync'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine, useSetup } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
import useToast from '@hooks/useToast'
import deletePublication from '@graphql/publications/delete-publication'

export function useDeletePublication() {
  const useStoreDeletePublication = createAsyncStore()
  const [stateDialogModalDeletePublication, sendDialogModalDeletePublication] = useMachine(
    dialog.machine({
      closeOnOutsideClick: false,
      closeOnEsc: false,
    }),
  )
  const apiDialogModalDeletePublication = createMemo(() =>
    dialog.connect(stateDialogModalDeletePublication, sendDialogModalDeletePublication, normalizeProps),
  )
  const refDialogModalDeletePublication = useSetup({ send: sendDialogModalDeletePublication, id: createUniqueId() })
  const toast = useToast()
  const stateDeletePublication = useStoreDeletePublication()

  async function unindexPublication({ publicationId, successMessage, errorMessage }) {
    stateDeletePublication.setIsLoading(true)
    stateDeletePublication.setIsSuccess(false)
    stateDeletePublication.setError(null, false)
    try {
      const result = await deletePublication(publicationId)
      if (result?.error) {
        stateDeletePublication.setIsSuccess(false)
        stateDeletePublication.setIsLoading(false)
        stateDeletePublication.setError(result?.error?.message, true)
        //@ts-ignore
        toast().create({
          type: 'error',
          title: `${errorMessage}: ${result?.error?.message}`,
        })
        console.error(`${result?.error?.message}`)
        return
      }
      stateDeletePublication.setIsSuccess(true)
      stateDeletePublication.setIsLoading(false)
      stateDeletePublication.setError(null, false)
      //@ts-ignore
      toast().create({
        type: 'success',
        title: successMessage,
      })
    } catch (e) {
      stateDeletePublication.setIsSuccess(false)
      stateDeletePublication.setIsLoading(false)
      stateDeletePublication.setError(e?.message ?? e, true)
      //@ts-ignore
      toast().create({
        type: 'error',
        title: `${errorMessage}: ${e?.message ?? e}`,
      })
      console.error(e)
    }
  }

  return {
    unindexPublication,
    stateDeletePublication,
    apiDialogModalDeletePublication,
    refDialogModalDeletePublication,
  }
}

export default useDeletePublication
