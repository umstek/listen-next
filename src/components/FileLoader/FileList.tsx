import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtual } from '@tanstack/react-virtual';
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Play } from '@phosphor-icons/react';

import { FileEntity, FileSystemEntity } from '~lib/FileLoader';

import usePlayer from '~hooks/usePlayer';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ':ui/table';
import { Button } from ':ui/button';

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
    <div className="flex gap-2 invisible group-hover:visible">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();

          if (row.original.kind === 'file' && url) {
            playPause(url);
          }
        }}
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
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
  const player = usePlayer();

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
        cell: (props) => (
          <RowActions
            row={props.row}
            playPause={(url) => {
              player.setSource(url);
              player.playPause();
            }}
          />
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: data.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1].end || 0)
      : 0;

  return (
    <div
      ref={tableContainerRef}
      className="rounded-b-md border h-[500px] overflow-auto"
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {paddingTop > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {table.getRowModel().rows?.length ? (
            virtualRows.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <TableRow
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
          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
