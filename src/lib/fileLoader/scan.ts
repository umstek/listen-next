import type { DirectoryEntity } from './entity';
import type { FileEntity } from './entity';
import { isADirectory, isAFile } from './util';

/**
 * Recursively retrieves files and folders from a given directory.
 *
 * @param directoryEntity The directory entity to start from.
 * @param type (Optional) Regular expression to filter files by type.
 * @returns an object containing the retrieved files and directories.
 */
export async function getFilesAndFoldersRecursively(
  directoryEntity: DirectoryEntity,
  type?: RegExp,
) {
  const basePath = directoryEntity.path;
  const directories: DirectoryEntity[] = [];
  const files: FileEntity[] = [];
  for await (const handle of directoryEntity.handle?.values() || []) {
    if (handle.kind === 'directory') {
      const subdirectoryEntity: DirectoryEntity = {
        kind: 'directory',
        name: handle.name,
        parent: basePath,
        path: `${basePath}/${handle.name}`,
        handle,
      };
      directories.push(subdirectoryEntity);
      const { files: f, directories: d } = await getFilesAndFoldersRecursively(
        subdirectoryEntity,
        type,
      );
      directories.push(...d);
      files.push(...f);
    } else if (handle.kind === 'file') {
      const file = await handle.getFile();
      if (type && !type.test(file.name)) {
        continue;
      }
      Object.defineProperty(file, 'webkitRelativePath', {
        configurable: true,
        enumerable: true,
        get: () => `${basePath}/${handle.name}`,
      });
      files.push({
        kind: 'file',
        name: handle.name,
        parent: basePath,
        path: `${basePath}/${handle.name}`,
        handle,
        file,
      });
    }
  }

  return { files, directories };
}

/**
 * Scans a directory entry and returns a list of files and directories.
 *
 * @param directoryEntry The directory entry to scan.
 * @param type Optional regular expression to filter file names.
 * @returns a promise that resolves to an object containing arrays of files and
 * directories found in the scanned directory.
 */
export async function scanDirectoryEntry(
  directoryEntry: FileSystemDirectoryEntry,
  type?: RegExp,
) {
  try {
    const directoryReader = directoryEntry.createReader();

    const directories: DirectoryEntity[] = [];
    const files: FileEntity[] = [];

    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });

    for (const entry of entries) {
      if (isADirectory(entry)) {
        const directoryEntity: DirectoryEntity = {
          kind: 'directory',
          name: entry.name,
          parent: directoryEntry.fullPath,
          path:
            entry.fullPath ||
            `${directoryEntry.fullPath || directoryEntry.name}/${entry.name}`,
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
          get: () =>
            entry.fullPath ||
            `${directoryEntry.fullPath || directoryEntry.name}/${entry.name}`,
        });
        files.push({
          kind: 'file',
          name: entry.name,
          parent: directoryEntry.fullPath,
          path: entry.name,
          handle: undefined,
          file,
        });
      }
    }

    return { files, directories };
  } catch (error) {
    console.error(error);
  }

  return undefined;
}
