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
