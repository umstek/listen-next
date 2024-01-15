import {
  Browser,
  DotsThree,
  FileAudio,
  FolderSimple,
  HardDrive,
  Planet,
} from '@phosphor-icons/react';
import { DropdownMenu, IconButton, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';

import { NotImplementedDialog } from ':Dialogs/NotImplementedAlert';

interface TileBodyProps {
  title: string;
  kind: 'file' | 'directory';
  source: 'sandbox' | 'local' | 'remote';
}

export function Thumbnail({ title, kind, source }: TileBodyProps): JSX.Element {
  const Icon = { sandbox: Browser, local: HardDrive, remote: Planet }[source];

  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  return (
    <>
      <NotImplementedDialog
        open={showNotImplementedDialog}
        onOpenChange={setShowNotImplementedDialog}
      />
      <div className="invisible absolute right-4 top-4 group-hover/tile:visible">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton radius="full" variant="ghost">
              <DotsThree size={24} weight="bold" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              shortcut="⌘ P"
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Play
            </DropdownMenu.Item>
            <DropdownMenu.Item
              shortcut="⌘ A"
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Add to current playlist
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              shortcut="⌘ F"
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Favorite
            </DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Add to playlist</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Playlist 1
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Playlist 2
                </DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  More playlists...
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Create playlist...
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator />
            <DropdownMenu.Item
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Hide
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Re-index
            </DropdownMenu.Item>
            <DropdownMenu.Item
              shortcut="⌘ ⌫"
              color="red"
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="mt-4 flex flex-col items-center justify-start">
        {kind === 'file' && (
          <FileAudio className="fill-current" size={64} weight="thin" />
        )}
        {kind === 'directory' && (
          <FolderSimple className="fill-current" size={64} weight="thin" />
        )}
        <Tooltip content={title}>
          <p className="text-sm line-clamp-2 select-none overflow-hidden text-ellipsis break-all">
            {title}
          </p>
        </Tooltip>
      </div>
      <div className="flex w-full justify-center gap-1">
        {kind === 'file' && (
          <Icon
            className="fill-current"
            size={16}
            alt={`File location: ${source}`}
          />
        )}
      </div>
    </>
  );
}
