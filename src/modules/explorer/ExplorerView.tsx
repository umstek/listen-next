import { DotsThree } from '@phosphor-icons/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from '@radix-ui/react-icons';
import { DropdownMenu, Flex, IconButton } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import env from '~config';
import { db } from '~lib/db';
import {
  MountingExplorer,
  filterByExtensions,
  localLinkStrategy,
} from '~lib/explorer';
import type { AudioMetadata } from '~models/AudioMetadata';
import type { PlaylistItem } from '~models/Playlist';
import {
  appendItems,
  createFromItems,
  insertItemsAt,
} from '~modules/playlist/playlistSlice';

import { Breadcrumb, Breadcrumbs } from ':Breadcrumbs';
import { NotImplementedDialog } from ':Dialogs/NotImplementedAlert';
import { Thumbnail } from ':ExplorerTileBody';
import { TileView } from ':TileView';

const audioFilesFilter = filterByExtensions(new Set(env.supportedExtensions));

interface BreadcrumbsControlsProps {
  onBack?: () => void;
  onForward?: () => void;
  onUp?: () => void;
}

function BreadcrumbsControls({
  onBack,
  onForward,
  onUp,
}: BreadcrumbsControlsProps) {
  return (
    <Flex>
      <Flex className="group/breadcrumbs-controls">
        <IconButton variant="soft" className="rounded-r-[0]" onClick={onUp}>
          <ArrowUpIcon />
        </IconButton>
        <IconButton variant="soft" className="rounded-[0]" onClick={onBack}>
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          variant="soft"
          className="rounded-l-[0]"
          onClick={onForward}
        >
          <ArrowRightIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
}

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
      setPathDirs(pathDirs);
    }
  }, []);

  useEffect(() => {
    explorerRef.current = new MountingExplorer([localLinkStrategy]);

    refresh();
  }, [refresh]);

  return (
    <div className="h-full w-full overflow-auto">
      <BreadcrumbsControls
        onUp={async () => {
          await explorerRef.current?.changeDirectory('..');
          await refresh();
        }}
      />
      <Breadcrumbs>
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
              // @ts-expect-error XXX Polyfill conflict
              item.kind === 'file' && localLinkStrategy.test(item)
                ? 'local'
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
                        onClick={async () => {
                          if (item.kind === 'directory') {
                            const ex = await explorerRef.current?.spawn(
                              item.name,
                            );
                            if (!ex) return;

                            const items = await ex.listItems();
                            // TODO Recursively get files and queue them.
                            // TODO Optimization: queue 5 and start, then queue
                            // the rest with a worker.
                          } else if (item.kind === 'file') {
                            const mountStrategy =
                              await explorerRef.current?.getMountStrategy(
                                item.name,
                              );

                            const file = mountStrategy
                              ? await (
                                  await explorerRef.current?.mount(item.name)
                                )?.getFile()
                              : await item.getFile();

                            if (file) {
                              const audioMetadata = await db.audioMetadata.get({
                                path: `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                              });

                              console.log(
                                `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                                audioMetadata,
                              );

                              audioMetadata &&
                                dispatch(
                                  createFromItems([
                                    metadataToPlaylistItem(audioMetadata),
                                  ]),
                                );
                            }
                          }
                        }}
                      >
                        Play
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        shortcut="⌘ N"
                        onClick={async () => {
                          if (item.kind === 'directory') {
                            const ex = await explorerRef.current?.spawn(
                              item.name,
                            );
                            if (!ex) return;

                            const items = await ex.listItems();
                            // TODO Recursively get files and queue them.
                            // TODO Optimization: queue 5 and start, then queue
                            // the rest with a worker.
                          } else if (item.kind === 'file') {
                            const mountStrategy =
                              await explorerRef.current?.getMountStrategy(
                                item.name,
                              );

                            const file = mountStrategy
                              ? await (
                                  await explorerRef.current?.mount(item.name)
                                )?.getFile()
                              : await item.getFile();

                            if (file) {
                              const audioMetadata = await db.audioMetadata.get({
                                path: `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                              });

                              console.log(
                                `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                                audioMetadata,
                              );

                              audioMetadata &&
                                dispatch(
                                  insertItemsAt({
                                    items: [
                                      metadataToPlaylistItem(audioMetadata),
                                    ],
                                  }),
                                );
                            }
                          }
                        }}
                      >
                        Play next
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        shortcut="⌘ A"
                        onClick={async () => {
                          if (item.kind === 'directory') {
                            const ex = await explorerRef.current?.spawn(
                              item.name,
                            );
                            if (!ex) return;

                            const items = await ex.listItems();
                            // TODO Recursively get files and queue them.
                            // TODO Optimization: queue 5 and start, then queue
                            // the rest with a worker.
                          } else if (item.kind === 'file') {
                            const mountStrategy =
                              await explorerRef.current?.getMountStrategy(
                                item.name,
                              );

                            const file = mountStrategy
                              ? await (
                                  await explorerRef.current?.mount(item.name)
                                )?.getFile()
                              : await item.getFile();

                            if (file) {
                              const audioMetadata = await db.audioMetadata.get({
                                path: `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                              });

                              console.log(
                                `${explorerRef.current?.getPathAsString()}/${
                                  item.name
                                }`,
                                audioMetadata,
                              );

                              audioMetadata &&
                                dispatch(
                                  appendItems([
                                    metadataToPlaylistItem(audioMetadata),
                                  ]),
                                );
                            }
                          }
                        }}
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
              const audioMetadata = await db.audioMetadata.get({
                path: `${explorerRef.current?.getPathAsString()}/${item.name}`,
              });

              console.log(
                `${explorerRef.current?.getPathAsString()}/${item.name}`,
                audioMetadata,
              );

              audioMetadata &&
                dispatch(
                  createFromItems([metadataToPlaylistItem(audioMetadata)]),
                );
            }
          }
        }}
      />
    </div>
  );
}

function metadataToPlaylistItem(metadata: AudioMetadata): PlaylistItem {
  return {
    album: metadata.album || '',
    artist: metadata.artists?.join(', ') || '',
    title: metadata.title || '',
    duration: Math.floor((metadata.duration || 0) * 1000),
    createdAt: Date.now(),
    fileId: metadata.id,
    path: metadata.path,
  };
}
