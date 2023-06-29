import {
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ':ui/table';
import { FileEntity, FileSystemEntity } from ':FileLoader';
import { Button } from ':ui/button';
import { Play } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useVirtual } from '@tanstack/react-virtual';

function RowActions({ row }: { row: Row<FileSystemEntity> }) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (row.original.kind === 'file') {
      const url = URL.createObjectURL((row.original as FileEntity).file);
      setUrl(url);
    }
  }, [row]);

  return (
    <div className="flex gap-2 invisible group-hover:visible">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          // Play audio file

          if (row.original.kind === 'file') {
            const audio = new Audio(url);
            audio.play();

            return () => {
              audio.pause();
              audio.currentTime = 0;
              audio.remove();
            };
          }
        }}
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}

const columnHelper = createColumnHelper<FileSystemEntity>();

export const columns = [
  columnHelper.group({
    id: 'parent',
    header: 'Parent',
    aggregationFn: 'count',
  }),
  columnHelper.accessor('name', { header: 'File Name' }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <RowActions row={props.row} />,
  }),
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// TODO Files and folders expanding tree view
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
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
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
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
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
