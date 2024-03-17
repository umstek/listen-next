// ref: https://web.dev/patterns/files/
import type { DirectoryEntity, FileEntity } from './entity';
import { getFilesAndFoldersRecursively } from './scan';
import { filePickerAcceptTypeExtToRegex } from './util';

/**
 * Open the directory picker and return an object containing arrays of files and
 * directories. Options will only work if the new directory picker API is
 * supported. Some output fields will also be undefined with the older picker.
 *
 * @param options.id A unique identifier for the directory picker.
 * @param options.mode The permission mode for the directory picker.
 * @param options.startIn The directory to start the picker in.
 * @returns An object containing arrays of files and directories.
 */
export async function openDirectory(
  options?: DirectoryPickerOptions & { types?: FilePickerAcceptType[] },
) {
  if (supportsDirectoryPicker()) {
    return openDirectoryWithNewPicker(options);
  }

  return openDirectoryWithOldPicker();
}

/**
 * Options for the directory picker dialog.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
 */
declare interface DirectoryPickerOptions {
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
}

/**
 * Well known directory names that can be used with the
 * DirectoryPickerOptions.startIn option.
 */
type WellKnownDirectoryNames =
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos';

/**
 * Checks if the browser supports the directory picker feature.
 *
 * @returns true if the browser supports directory picker, otherwise false.
 */
function supportsDirectoryPicker() {
  try {
    return 'showDirectoryPicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

/**
 * Opens a directory using the new picker.
 *
 * @param options Options for opening the directory.
 * @returns A promise that resolves to the files and folders in the selected directory.
 */
async function openDirectoryWithNewPicker(
  options?: DirectoryPickerOptions & { types?: FilePickerAcceptType[] },
) {
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

/**
 * Retrieves the list of files and folders within the specified directory.
 *
 * @param directoryEntry The handle to the directory.
 * @param types The accepted file types.
 * @returns The list of files and directories.
 */
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

  const regex = filePickerAcceptTypeExtToRegex(types);
  const { files, directories } = await getFilesAndFoldersRecursively(
    rootDirectoryEntity,
    regex,
  );

  return { files, directories: [rootDirectoryEntity, ...directories] };
}

/**
 * Opens a directory using the old picker.
 *
 * @returns The result of calling the `openFilesWithOldPicker` function.
 */
function openDirectoryWithOldPicker() {
  return openFilesWithOldPicker(undefined, true);
}

/**
 * Opens files with the old picker.
 *
 * @param options Optional options for opening files.
 * @param directory Indicates if the files should be directories.
 * @returns A Promise that resolves to an object containing arrays of files and directories, or undefined if no files were selected.
 */
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

/**
 * Extracts directory paths from an array of parent paths.
 *
 * @param parentPaths An array of parent paths.
 * @returns An array of directory paths.
 */
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
 * @param options.multiple If `true`, multiple files can be selected.
 * @returns
 */
export async function openFiles(options: OpenFilesOptions) {
  if (supportsOpenFilePicker()) {
    return openFilesWithNewPicker(options);
  }

  return openFilesWithOldPicker(options);
}

/**
 * Options for opening files. Extends OpenFilePickerOptions.
 */
type OpenFilesOptions = OpenFilePickerOptions;

/**
 * Checks if the browser supports the open file picker feature.
 *
 * @returns true if the browser supports the open file picker feature, otherwise false.
 */
function supportsOpenFilePicker() {
  try {
    return 'showOpenFilePicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

/**
 * Asynchronously opens files using a new file picker.
 *
 * @param options The options for opening files.
 * @returns The files and directories opened.
 */
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
