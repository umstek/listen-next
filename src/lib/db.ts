import Dexie, { Table } from 'dexie';

import { FileSystemEntity } from '~models/FileSystemEntity';

export class Db extends Dexie {
  fs!: Table<FileSystemEntity>;

  constructor() {
    super('main');
    this.version(1).stores({
      fs: 'id, name, kind, parentId',
    });
  }
}

export const db = new Db();
