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
  Heading,
  IconButton,
  Text,
} from '@radix-ui/themes';

import config from '~config';
import { DirectoryEntity, FileEntity } from '~lib/FileLoader';

import { NotImplementedDialog } from ':NotImplementedDialog';

import { FileList } from './FileList';
import { DropZone } from './DropZone';
import { DropChoiceHelpAlert } from './DropChoiceHelpAlert';

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
    <Card variant="ghost">
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
        <Button variant="outline" onClick={() => onPlayNow(files)}>
          Play Now
        </Button>
        <Flex>
          <Button
            onClick={() => onCopy({ files, directories })}
            className="rounded-r-none"
          >
            Copy to Browser
          </Button>
          <DropdownMenu.Root>
            <DropdownMenuTrigger>
              <IconButton className="rounded-l-none">
                <ChevronDownIcon />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onLink({ files, directories })}>
                Store as Links
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu.Root>
        </Flex>
        <Button variant="outline" color="crimson" onClick={() => setFiles([])}>
          Clear
        </Button>
      </Flex>
    </Card>
  );
}
