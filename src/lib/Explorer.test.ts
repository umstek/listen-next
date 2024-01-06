import { describe, beforeEach, test, expect, beforeAll } from 'vitest';
import {
  FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from 'native-file-system-adapter';

import { Explorer } from './Explorer';

describe('Explorer', () => {
  let explorer: Explorer;
  let mockRootDirHandle: FileSystemDirectoryHandle;

  beforeAll(async () => {
    mockRootDirHandle = await getOriginPrivateDirectory(
      // @ts-expect-error This works anyway
      import('native-file-system-adapter/src/adapters/memory'),
    );

    explorer = new Explorer(mockRootDirHandle);
  });

  // XXX Tests are stateful; don't change the order.

  test('constructor should initialize with root directory', () => {
    expect(explorer).toBeDefined();
  });

  test('pwd should return the current working directory', async () => {
    const cwd = await explorer.getPathAsString();
    expect(cwd).toBe('/'); // Assuming the root directory is named '/'
  });

  test('mkdir should create a new directory', async () => {
    const newDirName = 'test';
    const newHandle = await explorer.createDirectory(newDirName);
    expect(newHandle.name).toBe(newDirName);
  });

  test('cd should change the current working directory', async () => {
    await explorer.changeDirectory('test');
    const cwd = await explorer.getPathAsString();
    expect(cwd).toBe('/test');
  });

  test('ls should list the entries in the current directory', async () => {
    await explorer.changeDirectory('..');
    await explorer.createDirectory('test2');
    const entries = await explorer.listItems();
    expect(entries.length).toBe(2);
    expect(entries[0].name).toBe('test');
    expect(entries[1].name).toBe('test2');
  });

  test('rm should remove a file or directory', async () => {
    const entryName = 'test';
    await explorer.remove(entryName);
    const entries = await explorer.listItems();
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('test2');
  });

  test('writeContent should write content to a file', async () => {
    const fileName = 'fileToWrite.txt';
    const content = 'hello';
    const file = new File([content], fileName);
    await explorer.putFile(file);
  });
});
