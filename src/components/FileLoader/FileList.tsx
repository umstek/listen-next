import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Flex,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableColumnHeaderCell,
  TableRow,
} from '@radix-ui/themes';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { Play } from '@phosphor-icons/react';

import { FileEntity, FileSystemEntity } from '~lib/FileLoader';

import usePlayer from '~hooks/usePlayer';

interface RowActionsProps {
  row: Row<FileSystemEntity>;
  preview: (url: string) => void;
  stopPreview: () => void;
}

function RowActions({ row, preview, stopPreview }: RowActionsProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (row.original.kind === 'file') {
      const fileEntity = row.original as FileEntity;
      const url = URL.createObjectURL(fileEntity.file);
      setUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [row.original]);

  return (
    <Flex className="invisible group-hover:visible">
      <IconButton
        variant="ghost"
        onMouseEnter={(e) => {
          e.stopPropagation();

          if (row.original.kind === 'file' && url) {
            preview(url);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();

          stopPreview();
        }}
      >
        <Play />
      </IconButton>
    </Flex>
  );
}

const columnHelper = createColumnHelper<FileSystemEntity>();

interface FileListProps {
  data: FileSystemEntity[];
}

type EmptyTableContentProps = {
  length: number;
};

function EmptyTableContent(props: EmptyTableContentProps): JSX.Element {
  return (
    <TableRow>
      <TableCell colSpan={props.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

export function FileList({ data }: FileListProps) {
  const { play, stop } = usePlayer();

  const preview = useCallback(
    (url: string) => {
      play({ url, seek: 10 });
    },
    [play],
  );
  const stopPreview = useCallback(() => {
    stop();
  }, [stop]);

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'parent',
        header: 'Parent',
        aggregationFn: 'count',
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
    [preview, stopPreview],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div ref={tableContainerRef}>
      <Table.Root>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableColumnHeaderCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableColumnHeaderCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <TableRow
                  align="center"
                  className="group"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <EmptyTableContent length={columns.length} />
          )}
        </TableBody>
      </Table.Root>
    </div>
  );
}
FileList.whyDidYouRender = true;
