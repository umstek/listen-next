import {
  ChevronDownIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';

import config from '~config';

import {
  FileEntity,
  handleDroppedFilesAndFolders,
  openDirectory,
  openFiles,
} from ':FileLoader';
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
import { DataTable, columns } from './FileList';
import { useState } from 'react';
import { NotImplementedDialog } from ':NotImplementedDialog';

const types = [
  {
    description: 'All Audio Files',
    accept: { 'audio/*': config.supportedExtensions },
  },
];

export function DropZone() {
  const [files, setFiles] = useState<FileEntity[]>([]);
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
            className="flex flex-col h-full w-full outline-1 outline-dashed outline-input rounded-lg justify-center items-center hover:bg-white"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();

              handleDroppedFilesAndFolders(e.dataTransfer, { types }).then(
                ({ files } = { files: [], directories: [] }) => setFiles(files),
              );
            }}
          >
            <div className="flex flex-col items-center space-y-8 p-8 max-w-md">
              <div className="flex flex-row space-x-4">
                <Button
                  variant="link"
                  onClick={() =>
                    openFiles({
                      multiple: true,
                      types,
                      excludeAcceptAllOption: true,
                    }).then(({ files } = { files: [], directories: [] }) =>
                      setFiles(files),
                    )
                  }
                >
                  Add Files
                </Button>
                <Button
                  onClick={() =>
                    openDirectory({ types }).then(
                      ({ files } = { files: [], directories: [] }) =>
                        setFiles(files),
                    )
                  }
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
        <Button variant="outline">Clear</Button>
      </CardFooter>
    </Card>
  );
}
