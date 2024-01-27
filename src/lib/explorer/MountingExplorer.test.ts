import {
  FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from 'native-file-system-adapter';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import MountingExplorer from './MountingExplorer';

describe('MountingExplorer', () => {
  let explorer: MountingExplorer;
  let mockRootDirHandle: FileSystemDirectoryHandle;

  beforeAll(async () => {
    mockRootDirHandle = await getOriginPrivateDirectory(
      // @ts-expect-error This works anyway
      import('native-file-system-adapter/src/adapters/memory'),
    );

    explorer = new MountingExplorer([], mockRootDirHandle);
  });

  // XXX Tests are stateful; don't change the order.

  test('constructor should initialize with root directory', () => {
    expect(explorer).toBeDefined();
  });

  test('getCurrentDirectory should return the current working directory', async () => {
    const cwd = explorer.getCurrentDirectory();
    expect(cwd).toBe(mockRootDirHandle);
  });

  test('getPathAsString should return the current directory path', async () => {
    const cwd = explorer.getPathAsString();
    console.log(cwd);
    expect(cwd).toBe('/');
  });
});
