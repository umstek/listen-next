import Dexie, { type Table } from 'dexie'

import type { AudioMetadata } from '~models/AudioMetadata'
import type { FileSystemEntityMetadata } from '~models/FileMetadata'

export class Db extends Dexie {
  linkedFSEs!: Table<FileSystemEntityMetadata>
  audioMetadata!: Table<AudioMetadata>

  constructor() {
    super('main')
    this.version(1).stores({
      linkedFSEs: 'id, name, kind, parentId',
      audioMetadata:
        'id, name, source, extension, mime, *genre, *artists, album, title, trackNumber, trackCount, duration, year',
    })
  }
}

export const db = new Db()
