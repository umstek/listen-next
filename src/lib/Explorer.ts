import {
  FileSystemDirectoryHandle,
  FileSystemHandle,
} from 'native-file-system-adapter';

import rootDirHandle from './vfs';

export async function listItems(handle: FileSystemDirectoryHandle) {
  const entries: FileSystemHandle[] = [];
  for await (const entry of handle.values()) {
    entries.push(entry);
  }
  return entries;
}

/**
 * The Explorer class provides methods for exploring and navigating a virtual file system.
 */
export class Explorer {
  private path: FileSystemDirectoryHandle[] = [];

  /**
   * Constructs a new instance of the class.
   *
   * @param root The root directory handle.
   */
  constructor(root = rootDirHandle) {
    if (!root) {
      throw new Error('Root directory not found');
    }

    this.path.push(root);
  }

  /**
   * Returns the current working directory.
   *
   * @returns The current working directory.
   */
  async getCurrentDirectory() {
    return this.path[this.path.length - 1];
  }

  /**
   * Returns the current working directory.
   *
   * @return The current working directory path.
   */
  async getPathAsString() {
    if (this.path.length <= 1) {
      return '/';
    }
    return this.path.map((handle) => handle.name).join('/');
  }

  /**
   * Retrieves the path as an array of FileSystemDirectoryHandle objects.
   *
   * @return The path as an array of FileSystemDirectoryHandle objects.
   */
  async getPath() {
    return this.path;
  }

  /**
   * Changes the current working directory to the specified path.
   *
   * @param path The path to change the current directory to.
   */
  async changeDirectory(path: string) {
    let pathSegments = path.split('/');
    if (path.startsWith('/')) {
      // Absolute path
      this.path = [this.path[0]];
    }
    // Avoid empty segments in the path in case of absolute path or trailing "/"
    pathSegments = pathSegments.filter(Boolean);

    for (const segment of pathSegments) {
      if (segment === '.') {
        // Do nothing
        continue;
      }

      if (segment === '..') {
        // Go up
        if (this.path.length <= 1) {
          return;
        }

        this.path.pop();
        continue;
      }

      const handle = this.path[this.path.length - 1];
      const childHandle = await handle.getDirectoryHandle(segment);
      this.path.push(childHandle);
    }
  }

  /**
   * Returns a list of FileSystemHandles in the current directory.
   *
   * @return An array of FileSystemHandles representing the entries in the current directory.
   */
  async listItems() {
    const handle = this.path[this.path.length - 1];

    return listItems(handle);
  }

  /**
   * Creates a new directory with the given name.
   *
   * @param name The name of the directory to create.
   * @return A promise that resolves to the new DirectoryHandle.
   */
  async createDirectory(name: string) {
    const handle = this.path[this.path.length - 1];
    const newHandle = await handle.getDirectoryHandle(name, {
      create: true,
    });
    return newHandle;
  }

  /**
   * Removes a file or directory with the given name.
   *
   * @param name The name of the file or directory to be removed.
   * @return A promise that resolves when the file or directory is successfully removed.
   */
  async remove(name: string) {
    const handle = this.path[this.path.length - 1];
    await handle.removeEntry(name);
  }

  /**
   * Writes the content to a file with the given name.
   *
   * @param name The name of the file to write.
   * @param content The content to write to the file.
   * @return A promise that resolves when the content has been written.
   */
  async putFile(file: File) {
    const folderHandle = this.path[this.path.length - 1];
    const fileHandle = await folderHandle.getFileHandle(file.name, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
  }

  /**
   * Retrieves the specified file.
   *
   * @param fileName The name of the file to retrieve.
   * @return A Promise that resolves to the retrieved file.
   */
  async getFile(fileName: string) {
    const handle = this.path[this.path.length - 1];
    const fileHandle = await handle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return file;
  }
}
