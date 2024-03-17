import {
  type FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from 'native-file-system-adapter';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import Explorer from '../explorer/Explorer';

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

  test('getCurrentDirectory should return the current working directory', async () => {
    const cwd = explorer.getCurrentDirectory();
    expect(cwd).toBe(mockRootDirHandle);
  });

  test('getPathAsString should return the current directory path', async () => {
    const cwd = explorer.getPathAsString();
    expect(cwd).toBe('/');
  });

  test('createDirectory should create a new directory', async () => {
    const newDirName = 'test';
    const newHandle = await explorer.createDirectory(newDirName);
    expect(newHandle.name).toBe(newDirName);
  });

  test('changeDirectory should change the current working directory', async () => {
    await explorer.changeDirectory('test');
    const cwd = explorer.getPathAsString();
    expect(cwd).toBe('/test');
  });

  test('listItems should list the entries in the current directory', async () => {
    await explorer.changeDirectory('..');
    await explorer.createDirectory('test2');
    const entries = await explorer.listItems();
    expect(entries.length).toBe(2);
    expect(entries[0].name).toBe('test');
    expect(entries[1].name).toBe('test2');
  });

  test('remove should remove a file or directory', async () => {
    const entryName = 'test';
    await explorer.remove(entryName);
    const entries = await explorer.listItems();
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('test2');
  });

  test('putFile should write content to a file', async () => {
    const fileName = 'fileToWrite.txt';
    const content = 'hello';
    const file = new File([content], fileName);
    await explorer.putFile(file);
  });

  test('getFile should read content from a file', async () => {
    const fileName = 'fileToRead.txt';
    const content = 'hello';
    const file = new File([content], fileName);
    await explorer.putFile(file);
    const fileContent = await explorer.getFile(fileName);
    expect(fileContent.name).toBe(fileName);
    expect(fileContent.size).toBe(content.length);
  });
});
