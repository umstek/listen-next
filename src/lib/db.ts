import Dexie, { Table } from 'dexie';

import { FileSystemEntityMetadata } from '~models/FileMetadata';

export class Db extends Dexie {
  fs!: Table<FileSystemEntityMetadata>;

  constructor() {
    super('main');
    this.version(1).stores({
      fs: 'id, name, kind, parentId',
    });
  }
}

export const db = new Db();
