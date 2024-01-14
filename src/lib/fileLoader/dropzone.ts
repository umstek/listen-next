import { DirectoryEntity, FileEntity } from './entity';
import { getFilesAndFoldersRecursively, scanDirectoryEntry } from './scan';
import { filePickerAcceptTypeExtToRegex, isADirectory, isAFile } from './util';

/**
 * Changes the drop effect.
 *
 * @param {DataTransfer} dataTransfer - The data transfer object.
 * @return {void} This function does not return a value.
 */
export function handleDragOverItems(dataTransfer: DataTransfer): void {
  const items = [...dataTransfer.items];
  const allItemsAreFiles = items.every((item) => item.kind === 'file');
  dataTransfer.dropEffect = allItemsAreFiles ? 'link' : 'none';
}

/**
 * Handles dropped files and folders.
 *
 * @param {DataTransfer} dataTransfer - The data transfer object.
 * @param {Object} options - The options object.
 * @param {FilePickerAcceptType[]} options.types - The accepted file types.
 * @return {Promise<{ files: FileEntity[], directories: DirectoryEntity[] } | undefined>} - The files and directories.
 */
export async function handleDroppedFilesAndFolders(
  dataTransfer: DataTransfer,
  { types }: { types?: FilePickerAcceptType[] },
): Promise<
  { files: FileEntity[]; directories: DirectoryEntity[] } | undefined
> {
  const type = types && filePickerAcceptTypeExtToRegex(types);

  const fileItems = [...dataTransfer.items].filter(
    (item) => item.kind === 'file',
  );

  const directories: DirectoryEntity[] = [];
  const files: FileEntity[] = [];
  if (supportsFileSystemAccessAPI()) {
    const promises = fileItems.map((item) => item.getAsFileSystemHandle());
    const results = await Promise.allSettled(promises);
    const handles = results
      .filter(
        (result): result is PromiseFulfilledResult<FileSystemHandle> =>
          result.status === 'fulfilled' && !!result.value,
      )
      .map((result) => result.value);
    for (const handle of handles) {
      if (isADirectory(handle)) {
        const directoryEntity: DirectoryEntity = {
          kind: 'directory',
          name: handle.name,
          parent: undefined,
          path: handle.name,
          handle,
        };
        const { files: childFiles, directories: childDirectories } =
          await getFilesAndFoldersRecursively(directoryEntity, type);
        directories.push(directoryEntity, ...childDirectories);
        files.push(...childFiles);
      } else if (isAFile(handle)) {
        const file = await handle.getFile();
        if (type && !type.test(file.name)) {
          continue;
        }
        Object.defineProperty(file, 'webkitRelativePath', {
          configurable: true,
          enumerable: true,
          get: () => undefined,
        });
        files.push({
          kind: 'file',
          name: handle.name,
          parent: undefined,
          path: handle.name,
          handle,
          file,
        });
      }
    }

    return { files, directories };
  } else if (supportsWebkitGetAsEntry()) {
    const entries = fileItems
      .map((item) => item.webkitGetAsEntry())
      .filter(Boolean);
    for (const entry of entries) {
      if (isADirectory(entry)) {
        const directoryEntity: DirectoryEntity = {
          kind: 'directory',
          name: entry.name,
          parent: undefined,
          path: entry.fullPath || entry.name,
          handle: undefined,
        };
        const { files: childFiles, directories: childDirectories } =
          (await scanDirectoryEntry(entry, type)) || {
            files: [],
            directories: [],
          };
        directories.push(directoryEntity, ...childDirectories);
        files.push(...childFiles);
      } else if (isAFile(entry)) {
        const file = await new Promise<File>((resolve, reject) =>
          entry.file(resolve, reject),
        );
        if (type && !type.test(file.name)) {
          continue;
        }
        Object.defineProperty(file, 'webkitRelativePath', {
          configurable: true,
          enumerable: true,
          get: () => entry.name,
        });
        files.push({
          kind: 'file',
          name: entry.name,
          parent: undefined,
          path: entry.name,
          handle: undefined,
          file,
        });
      }
    }

    return { files, directories };
  } else {
    return undefined;
  }
}

/**
 * Checks if the browser supports the FileSystem Access API.
 *
 * @returns true if the browser supports the API, otherwise false.
 */
function supportsFileSystemAccessAPI() {
  try {
    return 'getAsFileSystemHandle' in DataTransferItem.prototype;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the browser supports the webkitGetAsEntry method.
 *
 * @returns true if the browser supports the method, false otherwise.
 */
function supportsWebkitGetAsEntry() {
  try {
    return 'webkitGetAsEntry' in DataTransferItem.prototype;
  } catch (error) {
    return false;
  }
}
