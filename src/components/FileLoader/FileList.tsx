import { Play } from '@phosphor-icons/react'
import { Checkbox, Flex, IconButton, Table } from '@radix-ui/themes'
import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type Row,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import usePlayer from '~hooks/usePlayer'
import type { FileEntity, FileSystemEntity } from '~lib/fileLoader'

interface RowActionsProps {
  row: Row<FileSystemEntity>
  preview: (url: string) => void
  stopPreview: () => void
}

function RowActions({ row, preview, stopPreview }: RowActionsProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (row.original.kind === 'file') {
      const fileEntity = row.original as FileEntity
      const url = URL.createObjectURL(fileEntity.file)
      setUrl(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [row.original])

  return (
    <Flex className="invisible group-hover:visible">
      <IconButton
        variant="ghost"
        size="1"
        onMouseEnter={(e) => {
          e.stopPropagation()

          if (row.original.kind === 'file' && url) {
            preview(url)
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation()

          stopPreview()
        }}
      >
        <Play />
      </IconButton>
    </Flex>
  )
}

const columnHelper = createColumnHelper<FileSystemEntity>()

interface FileListProps {
  data: FileSystemEntity[]
  selected?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
}

type EmptyTableContentProps = {
  length: number
}

function EmptyTableContent(props: EmptyTableContentProps) {
  return (
    <Table.Row>
      <Table.Cell colSpan={props.length} className="h-24 text-center">
        No results.
      </Table.Cell>
    </Table.Row>
  )
}

export function FileList({
  data,
  selected = new Set(),
  onSelectionChange,
}: FileListProps) {
  const { play, stop } = usePlayer()

  const preview = useCallback(
    (url: string) => {
      play({ url, seek: 10 })
    },
    [play],
  )
  const stopPreview = useCallback(() => {
    stop()
  }, [stop])

  const toggleSelection = useCallback(
    (path: string) => {
      const newSelected = new Set(selected)
      if (newSelected.has(path)) {
        newSelected.delete(path)
      } else {
        newSelected.add(path)
      }
      onSelectionChange?.(newSelected)
    },
    [selected, onSelectionChange],
  )

  const toggleAll = useCallback(() => {
    if (selected.size === data.length) {
      onSelectionChange?.(new Set())
    } else {
      onSelectionChange?.(new Set(data.map((item) => item.path)))
    }
  }, [selected.size, data, onSelectionChange])

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: () => (
          <Checkbox
            checked={data.length > 0 && selected.size === data.length}
            onCheckedChange={toggleAll}
          />
        ),
        cell: (props: CellContext<FileSystemEntity, unknown>) => (
          <Checkbox
            checked={selected.has(props.row.original.path)}
            onCheckedChange={() => toggleSelection(props.row.original.path)}
          />
        ),
      }),
      columnHelper.accessor('name', { header: 'File Name' }),
      columnHelper.display({
        id: 'actions',
        cell: (props: CellContext<FileSystemEntity, unknown>) => (
          <RowActions
            row={props.row}
            preview={preview}
            stopPreview={stopPreview}
          />
        ),
      }),
    ],
    [preview, stopPreview, selected, toggleSelection, toggleAll, data.length],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  return (
    <div ref={tableContainerRef} className="overflow-auto h-[300px]">
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.ColumnHeaderCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.ColumnHeaderCell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows?.length ? (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              return (
                <Table.Row
                  align="center"
                  className="group"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )
            })
          ) : (
            <EmptyTableContent length={columns.length} />
          )}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
FileList.whyDidYouRender = true
