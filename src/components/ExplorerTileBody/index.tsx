import { NotImplementedDialog } from ':Dialogs/NotImplementedAlert'
import {
  Browser,
  DotsThree,
  FileAudio,
  FolderSimple,
  HardDrive,
  Planet,
} from '@phosphor-icons/react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from ':ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ':ui/tooltip'
import { IconButton } from ':layout/IconButton'

interface TileBodyProps {
  title: string
  kind: 'file' | 'directory'
  source: 'sandbox' | 'local' | 'remote'
  onPlay?: () => void
  onDelete?: () => void
}

export function Thumbnail({
  title,
  kind,
  source,
  onPlay,
  onDelete,
}: TileBodyProps) {
  const Icon = { sandbox: Browser, local: HardDrive, remote: Planet }[source]

  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false)

  return (
    <TooltipProvider>
      <NotImplementedDialog
        open={showNotImplementedDialog}
        onOpenChange={setShowNotImplementedDialog}
      />
      <div className="invisible absolute right-4 top-4 group-hover/tile:visible">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton className="rounded-full" variant="ghost">
              <DotsThree size={24} weight="bold" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onPlay && kind === 'file') {
                  onPlay()
                } else {
                  setShowNotImplementedDialog(true)
                }
              }}
              disabled={kind === 'directory'}
            >
              Play
              <span className="ml-auto text-xs">⌘ P</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Add to current playlist
              <span className="ml-auto text-xs">⌘ A</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Favorite
              <span className="ml-auto text-xs">⌘ F</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add to playlist</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Playlist 1
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Playlist 2
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  More playlists...
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowNotImplementedDialog(true)}
                >
                  Create playlist...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Hide
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowNotImplementedDialog(true)}
            >
              Re-index
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                if (onDelete) {
                  onDelete()
                } else {
                  setShowNotImplementedDialog(true)
                }
              }}
            >
              Delete
              <span className="ml-auto text-xs">⌘ ⌫</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-4 flex flex-col items-center justify-start">
        {kind === 'file' && (
          <FileAudio className="fill-current" size={64} weight="thin" />
        )}
        {kind === 'directory' && (
          <FolderSimple className="fill-current" size={64} weight="thin" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2 select-none overflow-hidden text-ellipsis break-all">
              {title}
            </p>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
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
    </TooltipProvider>
  )
}
