import { createSignal, For, Show } from 'solid-js'
import { flexRender, getCoreRowModel, createSolidTable } from '@tanstack/solid-table'
import useDeletePublication from '@hooks/useDeletePublication'
import Button from '@components/Button'
import { Portal } from 'solid-js/web'
import DialogModal from '@components/DialogModal'

const defaultColumns = [
  {
    header: () => 'Price',
    accessorKey: 'collectModule',
    cell: (info) => {
      let label
      if (info.getValue()?.type === 'FreeCollectModule') label = 'Free'
      else {
        label = `${info.getValue()?.amount?.value} ${info.getValue()?.amount?.asset?.symbol}`
      }
      return <span class="font-bold">{label}</span>
    },
  },
  {
    header: () => 'Referral fee on sale',
    accessorKey: 'collectModule',
    cell: (info) => {
      let label
      if (info.getValue()?.type === 'FreeCollectModule') label = '0%'
      else {
        label = `${info.getValue()?.referralFee ?? 0}%`
      }
      return <span class="font-bold">{label}</span>
    },
  },
  {
    header: () => 'N° of copies',
    accessorKey: 'collectModule',
    cell: (info) => {
      let label
      if (
        info.getValue()?.type === 'LimitedTimedFeeCollectModule' ||
        info.getValue()?.type === 'LimitedFeeCollectModule'
      )
        label = `Limited to ${info.getValue()?.collectLimit} copies`
      else {
        label = `∞`
      }
      return <span class="font-bold">{label}</span>
    },
  },
  {
    header: () => 'Followers only ?',
    accessorKey: 'collectModule',
    cell: (info) => <span class="font-bold">{info.getValue()?.followersOnly === true ? 'Yes' : 'No'}</span>,
  },
  {
    header: () => 'Flash sale ?',
    accessorKey: 'collectModule',
    cell: (info) => {
      let label
      if (info.getValue()?.type === 'LimitedTimedFeeCollectModule' || info.getValue()?.type === 'TimedFeeCollectModule')
        label = 'Yes'
      else {
        label = 'No'
      }
      return <span class="font-bold">{label}</span>
    },
  },
]

export const TableGamePass = (props) => {
  const { unindexPublication, stateDeletePublication, apiDialogModalDeletePublication } = useDeletePublication()
  const [idGamePassToDelete, setIdGamePassToDelete] = createSignal()

  const table = createSolidTable({
    get data() {
      return props.gamePassList
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  function onClickUnindexGamePass(id) {
    setIdGamePassToDelete(id)
    apiDialogModalDeletePublication().open()
  }

  return (
    <>
      <table class="table w-full border-solid border border-white border-opacity-15 overflow-hidden table-auto text-start">
        <thead class="block md:table-header-group">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr class="relative text-white text-opacity-40 border-b border-white border-opacity-15 text-2xs font-bold top-0 grid grid-cols-1 md:table-row">
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="sticky top-0 bg-[rgb(20,20,20)] md:table-cell text-start px-3 py-3 md:py-1.5">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )}
                </For>
                <th class="sticky top-0 bg-[rgb(20,20,20)] md:table-cell text-start px-3 py-3 md:py-1.5">Unindex</th>
              </tr>
            )}
          </For>
        </thead>
        <tbody class="block md:table-row-group rounded-b-md divide-y divide-solid divide-white divide-opacity-10">
          <For each={table.getRowModel().rows}>
            {(row, key) => (
              <tr class="grid grid-cols-1 md:table-row relative bg-white bg-opacity-0 hover:bg-opacity-5 focus-within:bg-opacity-7.5">
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="md:table-cell px-3 py-3.5 text-2xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )}
                </For>
                <td class="md:table-cell px-3 py-3.5 text-2xs">
                  <Button
                    aspect="outline-sm"
                    scale="xs"
                    intent="danger--revert"
                    onClick={() => onClickUnindexGamePass(props.gamePassList[key()].id)}
                  >
                    Unindex
                  </Button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot class="sr-only">
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      {apiDialogModalDeletePublication().isOpen && (
        <Portal>
          <DialogModal
            isDanger={true}
            hideCloseButton={true}
            description={`Unindexing a game pass is similar to deleting it: users won't be able to see it anymore. However, it will still be visible on chain.`}
            title="Are you sure you want to unindex this game pass ?"
            api={apiDialogModalDeletePublication}
          >
            <Show when={!stateDeletePublication.isSuccess}>
              <div class="animate-appear">
                <p>
                  Unindexing a game pass is similar to deleting it: users won't be able to see it anymore. However, it
                  will still be visible on chain.
                </p>
                <div class="flex flex-col space-y-4 xs:space-y-0 xs:space-i-4 xs:flex-row mt-8">
                  <Button
                    onClick={async () =>
                      await unindexPublication({
                        publicationId: idGamePassToDelete(),
                        successMessage: 'This game pass was unindexed successfully !',
                        errorMessage: "Something went wrong and this game pass couldn't be unindexed. ",
                      })
                    }
                    intent="danger"
                    class="w-full xs:w-auto"
                    disabled={stateDeletePublication.isLoading}
                    isLoading={stateDeletePublication.isLoading}
                  >
                    <Show when={stateDeletePublication.isError === false && !stateDeletePublication.isLoading}>
                      Yes, unindex this game pass
                    </Show>
                    <Show when={stateDeletePublication.isLoading}>Unindexing your game pass...</Show>
                    <Show when={stateDeletePublication.isError === true}>Try again</Show>
                  </Button>
                  <Button
                    intent="neutral--revert"
                    aspect="outline-sm"
                    class="w-full xs:w-auto"
                    disabled={stateDeletePublication.isLoading}
                    {...apiDialogModalDeletePublication().closeButtonProps}
                  >
                    Go back
                  </Button>
                </div>
              </div>
            </Show>
            <Show when={stateDeletePublication.isSuccess}>
              <div class="animate-appear">
                <p class="font-semibold">This game pass was unindexed successfully !</p>

                <Button
                  intent="neutral--revert"
                  aspect="outline-sm"
                  class="w-full xs:w-auto"
                  disabled={stateDeletePublication.isLoading}
                  {...apiDialogModalDeletePublication().closeButtonProps}
                >
                  Go back
                </Button>
              </div>
            </Show>
          </DialogModal>
        </Portal>
      )}
    </>
  )
}

export default TableGamePass
