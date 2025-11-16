import {
  ChevronDownIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useState } from 'react';

import config from '~config';
import { DirectoryEntity, FileEntity } from '~lib/fileLoader';

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  const selectedFiles = files.filter(f => selected.has(f.path));

  // Filter directories to only include those that are in the path of selected files
  const getRelevantDirectories = () => {
    if (selected.size === 0) return directories;

    const relevantDirs = new Set<DirectoryEntity>();

    // For each selected file, add all its ancestor directories
    for (const file of selectedFiles) {
      for (const dir of directories) {
        // Include directory if the file's path starts with the directory's path
        if (file.path.startsWith(dir.path + '/') || file.parent === dir.path) {
          relevantDirs.add(dir);
        }
      }
    }

    return Array.from(relevantDirs);
  };

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
        <FileList
          data={files}
          selected={selected}
          onSelectionChange={setSelected}
        />
      </Flex>
      <Flex justify="end" gap="2" align="center" pt="3" wrap="wrap">
        {selected.size > 0 && (
          <Text size="1" color="gray">
            {selected.size} selected
          </Text>
        )}
        <Tooltip content="Play the selected files without indexing.">
          <Button
            variant="outline"
            size="2"
            onClick={() => onPlayNow(selected.size > 0 ? selectedFiles : files)}
            disabled={files.length === 0}
          >
            Play Now
          </Button>
        </Tooltip>
        <Flex gap="0">
          <Tooltip content="Create a sandboxed copy of the selected files inside your browser.">
            <Button
              size="2"
              onClick={() => onCopy({
                files: selected.size > 0 ? selectedFiles : files,
                directories: getRelevantDirectories()
              })}
              className="rounded-r-[0]"
              disabled={files.length === 0}
            >
              Copy to Browser
            </Button>
          </Tooltip>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton size="2" className="rounded-l-[0]">
                <ChevronDownIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <Tooltip content="Store links to the original files/folders you dropped. You'll be asked for permission each time you open them and, the changes to the original files will be reflected here.">
                <DropdownMenu.Item
                  onClick={() => onLink({
                    files: selected.size > 0 ? selectedFiles : files,
                    directories: getRelevantDirectories()
                  })}
                >
                  Store as Links
                </DropdownMenu.Item>
              </Tooltip>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
        <Tooltip content={<StoreChoiceHelpAlert />}>
          <IconButton variant="ghost" size="2">
            <QuestionMarkCircledIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="outline"
          color="crimson"
          size="2"
          onClick={() => {
            setFiles([]);
            setSelected(new Set());
          }}
        >
          Clear
        </Button>
      </Flex>
    </Card>
  );
}
