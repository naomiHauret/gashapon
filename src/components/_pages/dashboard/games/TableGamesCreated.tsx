import { ROUTE_DASHBOARD_GAME_OVERVIEW } from '@config/routes'
import STATUS, {
  ABANDONWARE_STABLE,
  ABANDONWARE_UNSTABLE,
  COMPLETE,
  EARLY,
  END_OF_LIFE,
  IN_DEVELOPMENT,
  STABLE,
} from '@helpers/gameDevelopmentStages'
import { flexRender, getCoreRowModel, createSolidTable } from '@tanstack/solid-table'
import { Link } from 'solid-app-router'
import { For } from 'solid-js'

const defaultColumns = [
  {
    accessorFn: (row) => row.id,
    id: 'id',
    cell: (info) => (
      <>
        <span class="font-mono text-2xs">{info.getValue()}</span>
        <Link
          class="absolute top-0 left-0 w-full h-full z-10 opacity-0"
          href={ROUTE_DASHBOARD_GAME_OVERVIEW.replace(':idGame', info.getValue())}
        >
          Go to game overview page
        </Link>
      </>
    ),
    header: () => (
      <span>
        <span aria-hidden="true">#</span>
        <span class="sr-only">Identifier</span>
      </span>
    ),
  },
  {
    header: () => 'Thumbnail',
    accessorKey: 'thumbnail',
    cell: (info) => (
      <div class="relative w-32 md:w-auto md:h-20 lg:h-32 aspect-game-thumbnail overflow-hidden rounded-md bg-neutral-400">
        <img class="absolute w-full h-full object-cover" src={info.getValue()} alt="" />
      </div>
    ),
  },
  {
    header: () => 'Title',
    accessorKey: 'title',
    cell: (info) => <span class="font-bold">{info.getValue()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => (
      <span
        classList={{
          'flair-game-status--not-ready': [STATUS[IN_DEVELOPMENT].value, STATUS[EARLY].value].includes(info.getValue()),
          'flair-game-status--stable': [STATUS[STABLE].value, STATUS[COMPLETE].value].includes(info.getValue()),
          'flair-game-status--stable-eol': [STATUS[END_OF_LIFE].value, STATUS[ABANDONWARE_STABLE].value].includes(
            info.getValue(),
          ),
          'flair-game-status--abandonware-unstable': [STATUS[ABANDONWARE_UNSTABLE].value].includes(info.getValue()),
          'flair-game-status--undefined': !info.getValue() || info.getValue() === '',
        }}
        class="flair-game-status"
      >
        {!info.getValue() || info.getValue() === '' ? 'Not defined' : info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'genres',
    header: () => 'Genres',
    cell: (info) => (
      <ul class="flex space-y-3 text-2xs flex-col text-white text-opacity-75">
        <For each={info.getValue().split(';')}>
          {(genre) => (
            <li>
              {/* @ts-ignore */}
              {genre}
            </li>
          )}
        </For>
      </ul>
    ),
  },
  {
    accessorKey: 'platforms',
    header: () => 'Platforms',
    cell: (info) => (
      <ul class="text-white text-opacity-75 text-2xs flex space-y-4 flex-col">
        <For each={info.getValue().split(';')}>
          {(platform) => (
            <li>
              {/* @ts-ignore */}
              {platform}
            </li>
          )}
        </For>
      </ul>
    ),
  },
  {
    accessorKey: 'lastUpdated',
    header: () => 'Last update',
    cell: (info) => info.getValue(),
  },
]

export const TableGamesCreated = (props) => {
  const table = createSolidTable({
    get data() {
      return props.games
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
            </tr>
          )}
        </For>
      </thead>
      <tbody class="block md:table-row-group rounded-b-md divide-y divide-solid divide-white divide-opacity-10">
        <For each={table.getRowModel().rows}>
          {(row) => (
            <tr class="grid grid-cols-1 md:table-row relative bg-white bg-opacity-0 hover:bg-opacity-5 focus-within:bg-opacity-7.5">
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <td class="md:table-cell px-3 py-3.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                )}
              </For>
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
  )
}

export default TableGamesCreated
