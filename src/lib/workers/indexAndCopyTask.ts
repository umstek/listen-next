import { db } from '~lib/db';
import { Explorer } from '~lib/explorer';
import { DirectoryEntity, FileEntity } from '~lib/fileLoader';
import { getAudioMetadata } from '~lib/musicMetadata';
import { audioMetadataSchema } from '~models/AudioMetadata';

/**
 * Handler for indexAndCopy worker message event.
 * Indexes audio files and copies them to the file system.
 *
 * @param ev - Message event containing task ID, files and directories to process
 */
onmessage = async (
  ev: MessageEvent<{
    id: string;
    files: FileEntity[];
    directories: DirectoryEntity[];
  }>,
) => {
  const event = (action: string, data: Record<string, unknown> = {}) => ({
    task: 'indexAndCopy',
    id,
    action,
    ...data,
  });

  const { id, files, directories } = ev.data;
  const explorer = new Explorer();

  postMessage(
    event('start', {
      filesTotal: files.length,
      filesDone: 0,
      directoriesTotal: directories.length,
      directoriesDone: 0,
    }),
  );

  for (const d of directories) {
    if (d.parent && d.parent !== explorer.getPathAsString()) {
      await explorer.changeDirectory(`/${d.parent}`);
    }
    await explorer.createDirectory(d.name);
  }

  postMessage(event('progress', { directoriesDone: directories.length }));

  let filesDone = 0;
  for (const f of files) {
    if (f.parent && f.parent !== explorer.getPathAsString()) {
      await explorer.changeDirectory(`/${f.parent}`);
    }
    await explorer.putFile(f.file);

    const fileInfo = { name: f.name, path: f.path, source: 'local' };
    const [basicMetadata, _extendedMetadata] = await getAudioMetadata(f.file);
    await db.audioMetadata.add(
      audioMetadataSchema.parse({ ...basicMetadata, ...fileInfo }),
    );

    filesDone += 1;
    postMessage(event('progress', { filesDone }));
  }

  await explorer.changeDirectory('/');
  postMessage(event('done'));
};
