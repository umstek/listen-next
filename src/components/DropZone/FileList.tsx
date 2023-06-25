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
import { useEffect, useState } from 'react';

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

  return (
    <div className="rounded-md border">
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="group"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
