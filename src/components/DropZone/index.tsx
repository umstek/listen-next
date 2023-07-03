import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import config from '~config';
import { FileEntity } from '~lib/FileLoader';

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
import { DropBox } from './DropBox';
import { DropChoiceHelpAlert } from './DropChoiceHelpAlert';

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
        <DropBox
          onFilesAccepted={(fs) => setFiles(files.concat(fs))}
          types={types}
        >
          <DropChoiceHelpAlert />
        </DropBox>
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
