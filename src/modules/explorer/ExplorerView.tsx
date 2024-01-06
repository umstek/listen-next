import { useCallback, useEffect, useRef, useState } from 'react';

import { Explorer } from '~lib/Explorer';

import { Breadcrumb, Breadcrumbs } from ':Breadcrumbs';
import { TileView } from ':TileView';
import { Thumbnail } from ':ExplorerTileBody';

/**
 * Renders the Explorer view component.
 *
 * @return {JSX.Element} The rendered Explorer view.
 */
export function ExplorerView() {
  const explorerRef = useRef<Explorer | null>(null);
  const pathDirContentsRef = useRef<
    Map<FileSystemDirectoryHandle, FileSystemHandleUnion[]>
  >(new Map());
  const [pathDirs, setPathDirs] = useState<FileSystemDirectoryHandle[]>([]);

  const refresh = useCallback(async () => {
    const folder = await explorerRef?.current?.getCurrentDirectory();
    const pathDirs = await explorerRef?.current?.getPath();
    const content = await explorerRef?.current?.listItems();

    if (pathDirs && folder && content) {
      // @ts-expect-error XXX Polyfill conflict
      pathDirContentsRef.current.set(folder, content);
      // @ts-expect-error XXX Polyfill conflict
      setPathDirs([...pathDirs]);
      // XXX        ^ Explorer mutates the path, so have to make a copy.
    }
  }, []);

  useEffect(() => {
    explorerRef.current = new Explorer();

    refresh();
  }, [refresh]);

  return (
    <div>
      <Breadcrumbs
        onUp={async () => {
          await explorerRef.current?.changeDirectory('..');
          await refresh();
        }}
      >
        {pathDirs.map((folder, i) => {
          const dirPath = pathDirs
            .slice(i + 1)
            .map(() => '..')
            .join('/');

          return (
            <Breadcrumb
              key={folder.name}
              name={folder.name}
              itemNames={(pathDirContentsRef.current.get(folder) || [])
                .filter((c) => c.kind === 'directory')
                .map((c) => c.name)}
              onClick={async () => {
                await explorerRef.current?.changeDirectory(dirPath);
                await refresh();
              }}
              onItemClick={async (name) => {
                await explorerRef.current?.changeDirectory(
                  dirPath ? `${dirPath}/${name}` : name,
                );
                await refresh();
              }}
              selected={
                pathDirs[pathDirs.indexOf(folder) + 1]?.name || undefined
              }
            />
          );
        })}
      </Breadcrumbs>
      <TileView
        items={pathDirContentsRef.current.get(pathDirs.at(-1)!) || []}
        extractKey={(item) => item.name}
        renderItem={(item) => <Thumbnail kind={item.kind} title={item.name} />}
        onOpen={async (item) => {
          if (item.kind === 'directory') {
            await explorerRef.current?.changeDirectory(item.name);
            await refresh();
          } else if (item.kind === 'file') {
            console.log(item);
          }
        }}
      />
    </div>
  );
}
