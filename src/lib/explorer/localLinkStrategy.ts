import type {
  FileSystemFileHandle,
  FileSystemHandle,
} from 'native-file-system-adapter';

import { db } from '../db';

import Explorer from './Explorer';
import type { MountingStrategy } from './MountingExplorer';

/**
 * Configuration for mounting local directory links.
 * Defines the test function to identify local directory links,
 * and the mount handler to resolve the link and mount the directory.
 */
const localLinkStrategy: MountingStrategy = {
  name: 'LocalDirectoryLink',
  test: isLocalLink,
  mount: async (item) => {
    const handle = await indirectLocalLink(item);

    if (await tryHandlePermission(handle)) {
      return new Explorer(
        handle as unknown as ConstructorParameters<typeof Explorer>[0],
      );
    }

    throw new Error('Permission denied');
  },
};

export default localLinkStrategy;

/**
 * Checks if the given file item is a local file system link.
 *
 * Parses the file name to check if it has the expected format for
 * a local file system link: '@link-local'.
 *
 * @param item The file handle to check
 * @returns True if the item is a local file system link, false otherwise
 */
function isLocalLink(item: FileSystemHandle) {
  const [link, source] = (item.name.split(':', 1)[0] || '').split('-');
  return link === '@link' && source === 'local';
}

/**
 * Indirect a local file system link found in a file stored in the current fs.
 *
 * Parses the link data from the file item, gets the associated file system
 * handle from the database, and returns it if it matches the expected kind.
 * Otherwise throws an error.
 *
 * @param item The file item containing the link data
 * @returns The resolved file system handle
 */
async function indirectLocalLink(item: FileSystemFileHandle) {
  const [, , kind] = (item.name.split(':', 1)[0] || '').split('-');

  const file = await item.getFile();
  const data = JSON.parse(await file.text()) as { id: string };
  const dbo = await db.linkedFSEs.get(data.id);
  const handle = dbo?.locator as FileSystemHandleUnion;

  if (handle.kind !== kind) {
    throw new Error(`Not a ${kind}`);
  }
  return handle;
}

/**
 * Tries to get permission for the given file system handle.
 *
 * First checks if permission is already granted for the given mode.
 * If not, requests permission for the given mode.
 *
 * @param handle The file system handle to check/request permission for
 * @param mode The permission mode to check/request - 'read' or 'readwrite'
 * @returns True if permission was already granted or was granted from requesting it, false otherwise
 */
async function tryHandlePermission(
  handle: FileSystemHandleUnion,
  mode: 'read' | 'readwrite' = 'read',
) {
  if (
    (await handle.queryPermission({ mode })) === 'granted' ||
    (await handle.requestPermission({ mode })) === 'granted'
  ) {
    return true;
  }

  return false;
}
