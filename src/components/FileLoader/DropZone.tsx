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
        p="4"
        className={cn(
          'w-[400px] h-[300px] shadow-sm bg-gray-50 text-lime-600 rounded-3xl',
          draggingOver ? 'bg-lime-100 shadow-inner' : '',
        )}
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
        <Flex
          height="100%"
          direction="column"
          align="center"
          justify="center"
          className="pointer-events-none"
        >
          {draggingOver ? (
            <ArrowDownIcon className="h-10 w-10 animate-bounce" />
          ) : (
            <Flex direction="column" gap="3">
              <Flex justify="center" gap="3">
                <Button
                  className="pointer-events-auto"
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
                  className="pointer-events-auto"
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
