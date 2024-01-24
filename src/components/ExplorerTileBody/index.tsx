import {
  Browser,
  FileAudio,
  FolderSimple,
  HardDrive,
  Planet,
} from '@phosphor-icons/react';
import { Tooltip } from '@radix-ui/themes';

interface TileBodyProps {
  title: string;
  kind: 'file' | 'directory';
  source: 'sandbox' | 'local' | 'remote';
  addOn?: JSX.Element;
}

export function Thumbnail({
  title,
  kind,
  source,
  addOn,
}: TileBodyProps): JSX.Element {
  const Icon = { sandbox: Browser, local: HardDrive, remote: Planet }[source];

  return (
    <>
      {addOn}
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
