import {
  ChevronDownIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useState } from 'react';

import config from '~config';
import type { DirectoryEntity, FileEntity } from '~lib/fileLoader';

import { NotImplementedDialog } from ':Dialogs/NotImplementedAlert';

import { DropChoiceHelpAlert } from './DropChoiceHelpAlert';
import { DropZone } from './DropZone';
import { FileList } from './FileList';
import { StoreChoiceHelpAlert } from './StoreChoiceHelpAlert';

const types = [
  {
    description: 'All Audio Files',
    accept: { 'audio/*': config.supportedExtensions as `.${string}`[] },
  },
];

interface FileLoaderProps {
  onPlayNow: (files: FileEntity[]) => void;
  onCopy: (arg: {
    files: FileEntity[];
    directories: DirectoryEntity[];
  }) => void;
  onLink: (arg: {
    files: FileEntity[];
    directories: DirectoryEntity[];
  }) => void;
}

export function FileLoader({ onPlayNow, onCopy, onLink }: FileLoaderProps) {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [directories, setDirectories] = useState<DirectoryEntity[]>([]);
  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  return (
    <div className="h-full w-full overflow-auto">
      <NotImplementedDialog
        open={showNotImplementedDialog}
        onOpenChange={setShowNotImplementedDialog}
      />
      <Flex direction="column" p="5">
        <Heading as="h3" size="5">
          Add Audio Files
        </Heading>
        <Text as="p">Drop files/folders here or browse.</Text>
      </Flex>
      <Flex direction="column">
        <DropZone
          onAccepted={({ files: fs, directories: ds }) => {
            setFiles(files.concat(fs));
            setDirectories(directories.concat(ds));
          }}
          types={types}
        >
          <DropChoiceHelpAlert />
        </DropZone>
        <FileList data={files} />
      </Flex>
      <Flex justify="end" gap="3" align="center" pt="3">
        {/* Store in Provider -- someday */}
        <Tooltip content="Play the selected files without indexing.">
          <Button variant="outline" onClick={() => onPlayNow(files)}>
            Play Now
          </Button>
        </Tooltip>
        <Flex>
          <Tooltip content="Create a sandboxed copy of the selected files inside your browser.">
            <Button
              onClick={() => onCopy({ files, directories })}
              className="rounded-r-[0]"
            >
              Copy to Browser
            </Button>
          </Tooltip>
          <DropdownMenu.Root>
            <DropdownMenuTrigger>
              <IconButton className="rounded-l-[0]">
                <ChevronDownIcon />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Tooltip content="Store links to the original files/folders you dropped. You'll be asked for permission each time you open them and, the changes to the original files will be reflected here.">
                <DropdownMenuItem
                  onClick={() => onLink({ files, directories })}
                >
                  Store as Links
                </DropdownMenuItem>
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu.Root>
        </Flex>
        <Tooltip content={<StoreChoiceHelpAlert />}>
          <QuestionMarkCircledIcon />
        </Tooltip>
        <Button variant="outline" color="crimson" onClick={() => setFiles([])}>
          Clear
        </Button>
      </Flex>
    </div>
  );
}
