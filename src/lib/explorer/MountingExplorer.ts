import type { FileSystemFileHandle } from 'native-file-system-adapter';

import Explorer from './Explorer';
import rootDirHandle from './vfs';

/**
 * MountingStrategy defines the interface for strategies that can
 * mount Explorer instances for different file system items.
 * It includes methods to test if an item can be mounted with this
 * strategy, as well as mount the item and return an Explorer instance.
 */
export interface MountingStrategy {
  name: string;
  test: (item: FileSystemFileHandle) => Promise<boolean> | boolean;
  mount: (
    item: FileSystemFileHandle,
  ) =>
    | Promise<Explorer>
    | Explorer
    | Promise<FileSystemFileHandle>
    | FileSystemFileHandle;
}

/**
 * MountingExplorer manages a stack of mounted Explorer instances,
 * allowing files/folders to be mounted and providing an API
 * to interact with the currently mounted Explorer.
 *
 * It initializes with a root Explorer and provides methods to
 * traverse the directory structure, as well as mount and unmount
 * files/folders using the provided MountingStrategy implementations.
 */
export default class MountingExplorer {
  private mountStack: Explorer[] = [];

  constructor(
    private strategies: MountingStrategy[] = [],
    root = rootDirHandle,
  ) {
    this.mountStack.push(new Explorer(root));
  }

  getCurrentDirectory() {
    return this.mountStack.at(-1)!.getCurrentDirectory();
  }

  getPath() {
    return this.mountStack.at(-1)!.getPath();
  }

  getPathAsString() {
    return this.mountStack.at(-1)!.getPathAsString();
  }

  async changeDirectory(path: string) {
    // Extract separate mount points if any. Double slash `//` was chosen since
    // there cannot be empty file/folder names other than the OPFS root folder
    // itself, and because `/` is the only prohibited file name character in
    // some systems.
    const paths = path.split('//');
    for (const path of paths) {
      if (path) {
        await this.mountStack.at(-1)!.changeDirectory(path);
      }
    }
  }

  async listItems() {
    return this.mountStack.at(-1)!.listItems();
  }

  async createDirectory(name: string) {
    return this.mountStack.at(-1)!.createDirectory(name);
  }

  async remove(name: string) {
    await this.mountStack.at(-1)!.remove(name);
  }

  async putFile(file: File) {
    return this.mountStack.at(-1)!.putFile(file);
  }

  async getFileHandle(fileName: string) {
    return this.mountStack.at(-1)!.getFileHandle(fileName);
  }

  async getFile(fileName: string) {
    return this.mountStack.at(-1)!.getFile(fileName);
  }

  /**
   * Asynchronously retrieves the mount strategy for the given file name.
   *
   * @param fileName the name of the file
   * @return the name of the mount strategy, or undefined if not found
   */
  async getMountStrategy(fileName: string) {
    const file = await this.getFileHandle(fileName);
    return this.strategies.find((s) => s.test(file))?.name;
  }

  /**
   * Async function to mount a file.
   *
   * @param fileName the name of the file to be mounted
   * @return a Promise of the mount result
   */
  async mount(fileName: string) {
    const file = await this.getFileHandle(fileName);
    const strategy = this.strategies.find((s) => s.test(file));
    if (!strategy) {
      throw new Error('Unable to mount.', {
        cause: `No MountStrategy found for ${fileName}.`,
      });
    }
    const mountResult = await strategy.mount(file);
    if (mountResult instanceof Explorer) {
      this.mountStack.push(mountResult);
      return undefined;
    }
    return mountResult;
  }

  /**
   * Unmounts the current directory from the mount stack.
   */
  unmount() {
    if (this.mountStack.length <= 1) {
      throw new Error('Unable to unmount.', {
        cause: 'Cannot unmount the root directory.',
      });
    }
    this.mountStack.pop();
  }

  async spawn(folderName: string) {
    if (folderName) {
      await this.changeDirectory(folderName);
    }
    const newExplorer = new MountingExplorer(
      this.strategies,
      this.getCurrentDirectory(),
    );
    if (folderName) {
      await this.changeDirectory('..');
    }

    return newExplorer;
  }
}
