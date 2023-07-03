import { useState } from 'react';
import { ArrowDownIcon } from '@radix-ui/react-icons';

import {
  FileEntity,
  handleDragOverItems,
  handleDroppedFilesAndFolders,
  openDirectory,
  openFiles,
} from '~lib/FileLoader';

import { cn } from '~util/styles';

import { Button } from ':ui/button';

export interface DropBoxProps {
  types?: FilePickerAcceptType[] | undefined;
  onFilesAccepted: (files: FileEntity[]) => void;
  children?: React.ReactNode;
}

export function DropBox({ onFilesAccepted, types, children }: DropBoxProps) {
  const [draggingOver, setDraggingOver] = useState(false);

  return (
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

          onFilesAccepted(fs);
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
                onFilesAccepted(fs);
              }}
            >
              Add Files
            </Button>
            <Button
              onClick={async () => {
                const { files: fs } = (await openDirectory({
                  types,
                })) || { files: [], directories: [] };

                onFilesAccepted(fs);
              }}
            >
              Add Folder
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
