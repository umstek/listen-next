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

function RowActions({
  row,
  playPause,
}: {
  row: Row<FileSystemEntity>;
  playPause: (url: string) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (row.original.kind === 'file') {
      const fileEntity = row.original as FileEntity;
      const url = URL.createObjectURL(fileEntity.file);
      setUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [row, playPause]);

  return (
    <Flex className="invisible group-hover:visible">
      <IconButton
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();

          if (row.original.kind === 'file' && url) {
            playPause(url);
          }
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
  const { setSource } = usePlayer({ autoPlay: true });
  const playPause = useCallback(
    (url: string) => {
      setSource(url);
    },
    [setSource],
  );

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
          <RowActions row={props.row} playPause={playPause} />
        ),
      }),
    ],
    [playPause],
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
