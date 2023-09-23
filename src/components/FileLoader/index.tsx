import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
} from '@radix-ui/themes';

import config from '~config';
import { FileEntity } from '~lib/FileLoader';

import { NotImplementedDialog } from ':NotImplementedDialog';

import { FileList } from './FileList';
import { DropZone } from './DropZone';
import { DropChoiceHelpAlert } from './DropChoiceHelpAlert';

const types = [
  {
    description: 'All Audio Files',
    accept: { 'audio/*': config.supportedExtensions },
  },
];

interface FileLoaderProps {
  onPlayNow: (files: FileEntity[]) => void;
}

export function FileLoader({ onPlayNow }: FileLoaderProps) {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  return (
    <Card>
      <NotImplementedDialog
        open={showNotImplementedDialog}
        onOpenChange={setShowNotImplementedDialog}
      />
      <Flex>
        <h3>Add Audio Files</h3>
        <p>Drop files/folders here or click to browse.</p>
      </Flex>
      <Flex direction="column">
        <DropZone
          onFilesAccepted={(fs) => setFiles(files.concat(fs))}
          types={types}
        >
          <DropChoiceHelpAlert />
        </DropZone>
        <FileList data={files} />
      </Flex>
      <Flex justify="end">
        {/* Store in Provider -- someday */}
        <Button variant="surface" onClick={() => onPlayNow(files)}>
          Play Now
        </Button>
        <Flex>
          <Button onClick={() => setShowNotImplementedDialog(true)}>
            Copy to Browser
          </Button>
          <DropdownMenu.Root>
            <DropdownMenuTrigger>
              <Button variant="solid">
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
          </DropdownMenu.Root>
        </Flex>
        <Button variant="outline" onClick={() => setFiles([])}>
          Clear
        </Button>
      </Flex>
    </Card>
  );
}
