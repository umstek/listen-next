import { Flex } from ':layout/Flex'
import { IconButton } from ':layout/IconButton'
import { Checkbox } from ':ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ':ui/table'
import { Play } from '@phosphor-icons/react'
import {
  type ColumnDef,
  type Row,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import usePlayer from '~hooks/usePlayer'
import type { FileEntity, FileSystemEntity } from '~lib/fileLoader'

const features = tableFeatures({})

interface RowActionsProps {
  row: Row<typeof features, FileSystemEntity>
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
    <TableRow>
      <TableCell colSpan={props.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
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

  const columns = useMemo<ColumnDef<typeof features, FileSystemEntity>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={data.length > 0 && selected.size === data.length}
            onCheckedChange={toggleAll}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.has(row.original.path)}
            onCheckedChange={() => toggleSelection(row.original.path)}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'File Name',
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <RowActions row={row} preview={preview} stopPreview={stopPreview} />
        ),
      },
    ],
    [preview, stopPreview, selected, toggleSelection, toggleAll, data.length],
  )

  const table = useTable({
    features,
    data,
    columns,
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              return (
                <TableRow className="group" key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <EmptyTableContent length={columns.length} />
          )}
        </TableBody>
      </Table>
    </div>
  )
}
FileList.whyDidYouRender = true
