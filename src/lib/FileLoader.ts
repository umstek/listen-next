// ref: https://web.dev/patterns/files/

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

/**
 * Feature detection. The API needs to be supported
 * and the app not run in an iframe.
 * @returns
 */
function supportsOpenFilePicker() {
  try {
    return 'showOpenFilePicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

async function openFilesWithNewPicker(options: OpenFilesOptions) {
  let files = undefined;
  try {
    files = await window.showOpenFilePicker(options);
  } catch (e) {
    const err = e as Error;
    // Fail silently if the user has simply canceled the dialog.
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }
  return files;
}

function openFilesWithOldPicker(options?: OpenFilesOptions, directory = false) {
  return new Promise((resolve) => {
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

      // Use undefined instead of null to indicate that no files were selected.
      resolve(input.files ? Array.from(input.files) : undefined);
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

interface OpenFilesOptions extends OpenFilePickerOptions {}

export async function openFiles(options: OpenFilesOptions) {
  if (supportsOpenFilePicker()) {
    return openFilesWithNewPicker(options);
  }

  return openFilesWithOldPicker(options);
}

/**
 * Feature detection. The API needs to be supported
 * and the app not run in an iframe.
 * @returns
 */
function supportsDirectoryPicker() {
  try {
    return 'showDirectoryPicker' in window && window.self === window.top;
  } catch (error) {
    return false;
  }
}

export async function openDirectory(mode = 'read') {
  if (supportsDirectoryPicker()) {
    return await openDirectoryWithNewPicker(mode);
  }

  return openDirectoryWithOldPicker();
}

function openDirectoryWithOldPicker() {
  return openFilesWithOldPicker(undefined, true);
}

async function getFiles(
  dirHandle: FileSystemDirectoryHandle,
  path = dirHandle.name,
) {
  const dirs = [];
  const files = [];
  for await (const entry of dirHandle.values()) {
    const nestedPath = `${path}/${entry.name}`;
    if (entry.kind === 'file') {
      files.push(
        entry.getFile().then((file) => {
          file.directoryHandle = dirHandle;
          file.handle = entry;
          return Object.defineProperty(file, 'webkitRelativePath', {
            configurable: true,
            enumerable: true,
            get: () => nestedPath,
          });
        }),
      );
    } else if (entry.kind === 'directory') {
      dirs.push(getFiles(entry, nestedPath));
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))];
}

async function openDirectoryWithNewPicker(mode: string) {
  let directoryStructure = undefined;

  try {
    const handle = await window.showDirectoryPicker({
      mode,
    });
    directoryStructure = getFiles(handle, undefined);
  } catch (e) {
    const err = e as Error;
    // Fail silently if the user has simply canceled the dialog.
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }
  return directoryStructure;
}
