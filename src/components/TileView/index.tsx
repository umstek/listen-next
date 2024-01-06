import {
  Browser,
  DotsThree,
  FileAudio,
  FolderSimple,
  HardDrive,
  Planet,
} from '@phosphor-icons/react';
import { IconButton, Tooltip } from '@radix-ui/themes';

interface TileBodyProps {
  title: string;
  kind: 'file' | 'directory';
}

export function Thumbnail({ title, kind }: TileBodyProps): JSX.Element {
  return (
    <>
      <div className="invisible absolute right-4 top-4 group-hover/tile:visible">
        <IconButton
          radius="full"
          variant="ghost"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DotsThree size={24} weight="bold" />
        </IconButton>
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
        <Browser className="fill-current" size={16} alt="browser sandbox" />
        <Planet className="fill-current" size={16} alt="online" />
        <HardDrive className="fill-current" size={16} alt="local file system" />
      </div>
    </>
  );
}

export function HTile({ title }: TileBodyProps): JSX.Element {
  return (
    <>
      <div className="flex gap-2">
        <div className="hidden group-hover/tile:block">
          <IconButton radius="full" variant="ghost">
            <DotsThree size={24} weight="bold" />
          </IconButton>
        </div>
        {/* <FileAudio className="fill-current" size={64} weight="thin" /> */}
        <FolderSimple
          className="fill-current group-hover/tile:hidden"
          size={24}
        />
        <p className="select-none">{title}</p>
      </div>
      <div className="flex w-full justify-end gap-1">
        <Browser className="fill-current" size={16} alt="browser sandbox" />
        <Planet className="fill-current" size={16} alt="online" />
        <HardDrive className="fill-current" size={16} alt="local file system" />
      </div>
    </>
  );
}
