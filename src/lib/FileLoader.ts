// ref: https://web.dev/patterns/files/

/**
 *
 * @param mode
 * @returns
 */
export async function openDirectory(mode = 'read') {
  if (supportsDirectoryPicker()) {
    return openDirectoryWithNewPicker(mode);
  }

  return openDirectoryWithOldPicker();
}

function supportsDirectoryPicker() {
  try {
    return 'showDirectoryPicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

async function openDirectoryWithNewPicker(mode: string) {
  try {
    const handle = await window.showDirectoryPicker({
      mode,
    });
    return getFilesAndFolders(handle);
  } catch (e) {
    const err = e as Error;
    // Fail silently if the user has simply canceled the dialog.
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }

  return undefined;
}

export async function getFilesAndFolders(
  directoryEntry: FileSystemDirectoryHandle,
) {
  const rootDirectoryEntity: DirectoryEntity = {
    kind: 'directory',
    handle: directoryEntry,
    name: directoryEntry.name,
    path: directoryEntry.name,
  };

  const { files, directories } = await getFilesAndFoldersRecursively(
    rootDirectoryEntity,
  );

  return { files, directories: [rootDirectoryEntity, ...directories] };
}

async function getFilesAndFoldersRecursively(directoryEntry: DirectoryEntity) {
  const basePath = directoryEntry.path;
  const directories: DirectoryEntity[] = [];
  const files: FileEntity[] = [];
  for await (const handle of directoryEntry.handle?.values() || []) {
    if (handle.kind === 'directory') {
      const directoryEntry: DirectoryEntity = {
        kind: 'directory',
        handle,
        name: handle.name,
        path: `${basePath}/${handle.name}`,
      };
      directories.push(directoryEntry);
      const { files: f, directories: d } = await getFilesAndFoldersRecursively(
        directoryEntry,
      );
      directories.push(...d);
      files.push(...f);
    } else if (handle.kind === 'file') {
      const file = await handle.getFile();
      Object.defineProperty(file, 'webkitRelativePath', {
        configurable: true,
        enumerable: true,
        get: () => `${basePath}/${handle.name}`,
      });
      files.push({
        kind: 'file',
        handle,
        name: handle.name,
        path: `${basePath}/${handle.name}`,
        file,
      });
    }
  }

  return { files, directories };
}

function openDirectoryWithOldPicker() {
  return openFilesWithOldPicker(undefined, true);
}

function openFilesWithOldPicker(options?: OpenFilesOptions, directory = false) {
  return new Promise<
    { files: FileEntity[]; directories: DirectoryEntity[] } | undefined
  >((resolve) => {
    // Append a new `<input type="file" multiple? />` and hide it.
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    document.body.append(input);
    if (directory) {
      input.webkitdirectory = true;
    } else if (options?.multiple) {
      input.multiple = true;
    }

    input.addEventListener('change', () => {
      // Remove the `<input type="file" multiple? />` again from the DOM.
      input.remove();

      const files = input.files
        ? Array.from(input.files).map(
            (file) =>
              ({
                file,
                handle: undefined,
                kind: 'file',
                name: file.name,
                path: file.webkitRelativePath || file.name,
              } as FileEntity),
          )
        : undefined;

      const directories = extractDirectoryPaths(
        files?.map((file) => file.path) || [],
      ).map(
        (path) =>
          ({
            handle: undefined,
            kind: 'directory',
            path: path,
            name: path.split('/').pop(),
          } as DirectoryEntity),
      );

      // Use undefined instead of null to indicate that no files were selected.
      resolve(files ? { files, directories } : undefined);
    });

    try {
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    } catch (error) {
      resolve(undefined);
    }
  });
}

function extractDirectoryPaths(filePaths: string[]) {
  const directoryPaths = new Set<string>();

  for (const filePath of filePaths) {
    const parts = filePath.split('/');
    for (let i = 1; i < parts.length; i++) {
      const directoryPath = parts.slice(0, i).join('/');
      directoryPaths.add(directoryPath);
    }
  }

  return Array.from(directoryPaths);
}

/**
 *
 * @param options
 * @returns
 */
export async function openFiles(options: OpenFilesOptions) {
  if (supportsOpenFilePicker()) {
    return openFilesWithNewPicker(options);
  }

  return openFilesWithOldPicker(options);
}

function supportsOpenFilePicker() {
  try {
    return 'showOpenFilePicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

async function openFilesWithNewPicker(options: OpenFilesOptions) {
  try {
    const files: FileEntity[] = [];
    for (const handle of await window.showOpenFilePicker(options)) {
      const file = await handle.getFile();
      Object.defineProperty(file, 'webkitRelativePath', {
        configurable: true,
        enumerable: true,
        get: () => handle.name,
      });
      files.push({
        kind: 'file',
        handle,
        file,
        name: handle.name,
        path: handle.name,
      });
    }
    return { files, directories: [] as DirectoryEntity[] };
  } catch (e) {
    const err = e as Error;
    // Fail silently if the user has simply canceled the dialog.
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }

  return undefined;
}

type OpenFilesOptions = OpenFilePickerOptions;

export interface FileSystemEntity {
  kind: 'file' | 'directory';
  name: string;
  path: string;
  handle: FileSystemHandle | undefined;
}

export interface FileEntity extends FileSystemEntity {
  kind: 'file';
  handle: FileSystemFileHandle | undefined;
  file: File;
}

export interface DirectoryEntity extends FileSystemEntity {
  kind: 'directory';
  handle: FileSystemDirectoryHandle | undefined;
}
