import { DotsThree } from '@phosphor-icons/react';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import env from '~config';
import {
  MountingExplorer,
  filterByExtensions,
  localLinkStrategy,
} from '~lib/explorer';
import { playlistItemSchema } from '~models/Playlist';
import { setItems } from '~modules/playlist/playlistSlice';

import { Breadcrumb, Breadcrumbs } from ':Breadcrumbs';
import { NotImplementedDialog } from ':Dialogs/NotImplementedAlert';
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

  const explorerRef = useRef<MountingExplorer | null>(null);
  const pathDirContentsRef = useRef<
    Map<FileSystemDirectoryHandle, FileSystemHandleUnion[]>
  >(new Map());
  const [pathDirs, setPathDirs] = useState<FileSystemDirectoryHandle[]>([]);

  const [showNotImplementedDialog, setShowNotImplementedDialog] =
    useState(false);

  const refresh = useCallback(async () => {
    const folder = explorerRef?.current?.getCurrentDirectory();
    const pathDirs = explorerRef?.current?.getPath();
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
    explorerRef.current = new MountingExplorer([localLinkStrategy]);

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
            addOn={
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
                        onClick={() =>
                          dispatch(setItems([playlistItemSchema.parse({})]))
                        }
                      >
                        Play
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        shortcut="⌘ N"
                        onClick={() => setShowNotImplementedDialog(true)}
                      >
                        Play next
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        shortcut="⌘ A"
                        onClick={() => setShowNotImplementedDialog(true)}
                      >
                        Append to current playlist
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        shortcut="⌘ F"
                        onClick={() => setShowNotImplementedDialog(true)}
                      >
                        Favorite
                      </DropdownMenu.Item>

                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>
                          Add to playlist
                        </DropdownMenu.SubTrigger>
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
              </>
            }
          />
        )}
        onOpen={async (item) => {
          if (item.kind === 'directory') {
            await explorerRef.current?.changeDirectory(item.name);
            await refresh();
          } else if (item.kind === 'file') {
            const mountStrategy = await explorerRef.current?.getMountStrategy(
              item.name,
            );

            const file = mountStrategy
              ? await (await explorerRef.current?.mount(item.name))?.getFile()
              : await item.getFile();

            if (file) {
              dispatch(setItems([URL.createObjectURL(file)]));
            }
          }
        }}
      />
    </div>
  );
}
