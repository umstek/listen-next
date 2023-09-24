import { useState } from 'react';
import { ArrowDownIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex } from '@radix-ui/themes';

import {
  FileEntity,
  handleDragOverItems,
  handleDroppedFilesAndFolders,
  openDirectory,
  openFiles,
} from '~lib/FileLoader';

import { cn } from '~util/styles';

export interface DropBoxProps {
  types?: FilePickerAcceptType[] | undefined;
  onFilesAccepted: (files: FileEntity[]) => void;
  children?: React.ReactNode;
}

export function DropZone({ onFilesAccepted, types, children }: DropBoxProps) {
  const [draggingOver, setDraggingOver] = useState(false);

  return (
    <Flex direction="column" justify="center" align="center" p="9">
      <Box
        className={cn('w-[300px] h-[300px]', draggingOver ? 'bg-red-500' : '')}
        onDragEnter={() => setDraggingOver(true)}
        onDragLeave={() => setDraggingOver(false)}
        onDragOver={(e) => {
          e.preventDefault();

          handleDragOverItems(e.dataTransfer);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          setDraggingOver(false);

          if (e.dataTransfer.items?.[0].kind !== 'file') {
            return;
          }

          const { files } = (await handleDroppedFilesAndFolders(
            e.dataTransfer,
            {
              types,
            },
          )) || { files: [], directories: [] };

          onFilesAccepted(files);
        }}
      >
        <Flex height="100%" direction="column" align="center" justify="center">
          {draggingOver ? (
            <ArrowDownIcon className="pointer-events-none" />
          ) : (
            <Flex direction="column" gap="3">
              <Flex justify="center" gap="3">
                <Button
                  variant="outline"
                  onClick={async () => {
                    const { files } = (await openFiles({
                      multiple: true,
                      types,
                      excludeAcceptAllOption: true,
                    })) || { files: [], directories: [] };
                    onFilesAccepted(files);
                  }}
                >
                  Add Files
                </Button>
                <Button
                  onClick={async () => {
                    const { files } = (await openDirectory({
                      types,
                    })) || { files: [], directories: [] };

                    onFilesAccepted(files);
                  }}
                >
                  Add Folder
                </Button>
              </Flex>
              {children}
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
