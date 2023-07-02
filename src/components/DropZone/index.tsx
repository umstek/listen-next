import { useState } from 'react';
import {
  QuestionMarkCircledIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';

import config from '~config';
import {
  FileEntity,
  handleDragOverItems,
  handleDroppedFilesAndFolders,
  openDirectory,
  openFiles,
} from '~lib/FileLoader';
import { cn } from '~util/styles';

import { Alert, AlertDescription, AlertTitle } from ':ui/alert';
import { Button } from ':ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ':ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ':ui/dropdown-menu';
import { NotImplementedDialog } from ':NotImplementedDialog';
import { DataTable, columns } from './FileList';

const types = [
  {
    description: 'All Audio Files',
    accept: { 'audio/*': config.supportedExtensions },
  },
];

export function DropZone() {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [draggingOver, setDraggingOver] = useState(false);
  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  return (
    <Card>
      <NotImplementedDialog
        open={showNotImplementedDialog}
        onOpenChange={setShowNotImplementedDialog}
      />
      <CardHeader>
        <CardTitle>Add Audio Files</CardTitle>
        <CardDescription>
          Drop files/folders here or click to browse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full bg-secondary rounded-t-lg p-4">
          <div
            className={cn(
              'flex flex-col h-full w-full rounded-lg justify-center items-center transition-colors duration-300 border border-dashed border-secondary-foreground',
              draggingOver ? 'bg-primary/5' : '',
            )}
            onDragEnter={() => setDraggingOver(true)}
            onDragLeave={() => setDraggingOver(false)}
            onDragOver={(e) => {
              e.preventDefault();

              handleDragOverItems(e.dataTransfer);
            }}
            onDrop={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setDraggingOver(false);

              if (e.dataTransfer.items?.[0].kind !== 'file') {
                return;
              }

              const { files: fs } = (await handleDroppedFilesAndFolders(
                e.dataTransfer,
                {
                  types,
                },
              )) || { files: [], directories: [] };

              setFiles(files.concat(fs));
            }}
          >
            <ArrowDownIcon
              className={cn(
                'h-8 w-8 animate-bounce pointer-events-none',
                draggingOver ? 'block' : 'hidden',
              )}
            />
            <div
              className={cn(
                'flex-col items-center space-y-8 p-8 max-w-md',
                draggingOver ? 'hidden' : 'flex',
              )}
            >
              <div className="flex flex-row space-x-4">
                <Button
                  variant="link"
                  onClick={async () => {
                    const { files: fs } = (await openFiles({
                      multiple: true,
                      types,
                      excludeAcceptAllOption: true,
                    })) || { files: [], directories: [] };
                    setFiles(files.concat(fs));
                  }}
                >
                  Add Files
                </Button>
                <Button
                  onClick={async () => {
                    const { files: fs } = (await openDirectory({
                      types,
                    })) || { files: [], directories: [] };

                    setFiles(files.concat(fs));
                  }}
                >
                  Add Folder
                </Button>
              </div>
              <Alert variant="default">
                <QuestionMarkCircledIcon className="h-4 w-4" />
                <AlertTitle>Files or Folders?</AlertTitle>
                <AlertDescription>
                  Consider organizing your audio content under a single folder
                  or a few folders on your operating system so you can easily
                  add them here.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <DataTable columns={columns} data={files} />
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {/* Store in Provider -- someday */}
        <Button variant="link">Play Now</Button>
        <div className="flex">
          <Button
            className="rounded-r-none pr-2"
            onClick={() => setShowNotImplementedDialog(true)}
          >
            Copy to Browser
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none p-2">
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setShowNotImplementedDialog(true)}
              >
                Store as Links
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" onClick={() => setFiles([])}>
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
