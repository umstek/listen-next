import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import env from '~config';
import { Explorer, filterByExtensions } from '~lib/Explorer';
import { db } from '~lib/db';
import { setItems } from '~modules/playlist/playlistSlice';

import { Breadcrumb, Breadcrumbs } from ':Breadcrumbs';
import { Thumbnail } from ':ExplorerTileBody';
import { TileView } from ':TileView';

const audioFilesFilter = filterByExtensions(new Set(env.supportedExtensions));

/**
 * Renders the Explorer view component.
 *
 * @return The rendered Explorer view.
 */
export function ExplorerView() {
  const dispatch = useDispatch();

  const explorerRef = useRef<Explorer | null>(null);
  const pathDirContentsRef = useRef<
    Map<FileSystemDirectoryHandle, FileSystemHandleUnion[]>
  >(new Map());
  const [pathDirs, setPathDirs] = useState<FileSystemDirectoryHandle[]>([]);

  const refresh = useCallback(async () => {
    const folder = await explorerRef?.current?.getCurrentDirectory();
    const pathDirs = await explorerRef?.current?.getPath();
    const content = (await explorerRef?.current?.listItems())?.filter(
      (i) =>
        i.kind === 'directory' ||
        i.name.startsWith('@link') ||
        audioFilesFilter(i),
    );

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
        renderItem={(item) => (
          <Thumbnail
            kind={item.kind}
            title={item.name}
            source={
              item.name.endsWith('.local.link')
                ? 'local'
                : item.name.endsWith('.remote.link')
                  ? 'remote'
                  : 'sandbox'
            }
          />
        )}
        onOpen={async (item) => {
          if (item.kind === 'directory') {
            await explorerRef.current?.changeDirectory(item.name);
            await refresh();
          } else if (item.kind === 'file') {
            /**
             * This isn't a real file, but a link
             */
            const linkTarget = await tryGetLinkTarget(item);
            if (linkTarget) {
              if (
                (await linkTarget.queryPermission({ mode: 'read' })) ===
                  'granted' ||
                (await linkTarget.requestPermission({ mode: 'read' })) ===
                  'granted'
              ) {
                if (linkTarget.kind === 'directory') {
                  // @ts-expect-error Polyfill conflict
                  explorerRef.current = new Explorer(linkTarget);
                  await refresh();
                } else if (linkTarget.kind === 'file') {
                  dispatch(
                    setItems([URL.createObjectURL(await linkTarget.getFile())]),
                  );
                }
              }

              return;
            }

            dispatch(setItems([URL.createObjectURL(await item.getFile())]));
          }
        }}
      />
    </div>
  );
}

async function tryGetLinkTarget(
  item: FileSystemFileHandle,
): Promise<FileSystemHandleUnion | undefined> {
  if (!item.name.startsWith('@link')) return;

  const [link, source, kind] = (item.name.split(':', 1)[0] || '').split('-');

  if (
    ![
      link === '@link',
      ['local', 'remote', 'sandbox'].includes(source),
      ['directory', 'file'].includes(kind),
    ].every(Boolean)
  ) {
    return;
  }

  const json = await item.getFile();
  try {
    const data = JSON.parse(await json.text()) as { id: string };
    const dbo = await db.linkedFSEs.get(data.id);
    const handle = dbo?.locator as FileSystemHandleUnion;

    if (handle.kind !== kind) return;
    return handle;
  } catch (error) {
    return;
  }
}
