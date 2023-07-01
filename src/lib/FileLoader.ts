// ref: https://web.dev/patterns/files/

/**
 * Open the directory picker and return an object containing arrays of files and
 * directories. Options will only work if the new directory picker API is
 * supported. Some output fields will also be undefined with the older picker.
 *
 * @param options.id - A unique identifier for the directory picker.
 * @param options.mode - The permission mode for the directory picker.
 * @param options.startIn - The directory to start the picker in.
 * @returns An object containing arrays of files and directories.
 */
export async function openDirectory(options?: DirectoryPickerOptions) {
  if (supportsDirectoryPicker()) {
    return openDirectoryWithNewPicker(options);
  }

  return openDirectoryWithOldPicker();
}

type WellKnownDirectoryNames =
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
 */
export declare interface DirectoryPickerOptions {
  /**
   * By specifying an ID, the browser can remember different directories for
   * different IDs. If the same ID is used for another picker, the picker opens
   * in the same directory.
   */
  id?: string;
  /**
   * A string that defaults to `"read"` for read-only access or `"readwrite"`
   * for read and write access to the directory.
   */
  mode?: FileSystemPermissionMode;
  /**
   * A `FileSystemHandle` or a well known directory (`"desktop"`, `"documents"`,
   * `"downloads"`, `"music"`, `"pictures"`, or `"videos"`) to open the dialog
   * in.
   */
  startIn?: FileSystemHandle | WellKnownDirectoryNames;

  // Non-standard properties
  types?: FilePickerAcceptType[] | undefined;
}

function supportsDirectoryPicker() {
  try {
    return 'showDirectoryPicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

async function openDirectoryWithNewPicker(options?: DirectoryPickerOptions) {
  try {
    const handle = await window.showDirectoryPicker(options);
    return getFilesAndFolders(handle, options?.types || []);
  } catch (e) {
    const err = e as Error;
    // Fail silently if the user has simply canceled the dialog.
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }

  return undefined;
}

async function getFilesAndFolders(
  directoryEntry: FileSystemDirectoryHandle,
  types: FilePickerAcceptType[],
) {
  const rootDirectoryEntity: DirectoryEntity = {
    kind: 'directory',
    name: directoryEntry.name,
    parent: undefined,
    path: directoryEntry.name,
    handle: directoryEntry,
  };

  const extensions = types
    .flatMap((t) => Object.values(t.accept))
    .flat()
    .map((a) => a.slice(1));
  const regex =
    extensions.length > 0
      ? new RegExp(`\\.(${extensions.join('|')})$`)
      : undefined;

  const { files, directories } = await getFilesAndFoldersRecursively(
    rootDirectoryEntity,
    regex,
  );

  return { files, directories: [rootDirectoryEntity, ...directories] };
}

async function getFilesAndFoldersRecursively(
  directoryEntry: DirectoryEntity,
  type?: RegExp,
) {
  const basePath = directoryEntry.path;
  const directories: DirectoryEntity[] = [];
  const files: FileEntity[] = [];
  for await (const handle of directoryEntry.handle?.values() || []) {
    if (handle.kind === 'directory') {
      const directoryEntry: DirectoryEntity = {
        kind: 'directory',
        name: handle.name,
        parent: basePath,
        path: `${basePath}/${handle.name}`,
        handle,
      };
      directories.push(directoryEntry);
      const { files: f, directories: d } = await getFilesAndFoldersRecursively(
        directoryEntry,
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

      const files: FileEntity[] | undefined = input.files
        ? Array.from(input.files).map((file) => ({
            kind: 'file',
            name: file.name,
            parent:
              file.webkitRelativePath.split('/').slice(0, -1).join('/') ||
              undefined,
            path: file.webkitRelativePath || file.name,
            handle: undefined,
            file,
          }))
        : undefined;

      const directories: DirectoryEntity[] = extractDirectoryPaths(
        files?.map((file) => file.parent).filter(Boolean) || [],
      ).map((path) => ({
        kind: 'directory',
        name: path.split('/').pop() || '',
        parent: path.split('/').slice(0, -1).join('/') || undefined,
        path,
        handle: undefined,
      }));

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

function extractDirectoryPaths(parentPaths: string[]) {
  const directoryPaths = new Set<string>();

  for (const dirPath of parentPaths) {
    const parts = dirPath.split('/');
    for (let i = 0; i < parts.length; i++) {
      const directoryPath = parts.slice(0, i).join('/');
      directoryPaths.add(directoryPath);
    }
  }

  return Array.from(directoryPaths);
}

/**
 * Open a file or files.
 *
 * @param options.multiple - If `true`, multiple files can be selected.
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
        name: handle.name,
        parent: undefined,
        path: handle.name,
        handle,
        file,
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
  parent: string | undefined;
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
