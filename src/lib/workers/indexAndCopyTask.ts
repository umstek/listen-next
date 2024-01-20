import { Explorer } from '~lib/Explorer';
import { db } from '~lib/db';
import { DirectoryEntity, FileEntity } from '~lib/fileLoader';
import { getAudioMetadata } from '~lib/musicMetadata';
import { audioMetadataSchema } from '~models/AudioMetadata';

const event = (action: string, data: Record<string, unknown> = {}) => ({
  ...data,
  action,
  task: 'indexAndCopy',
});

onmessage = async (
  ev: MessageEvent<{ files: FileEntity[]; directories: DirectoryEntity[] }>,
) => {
  const { files, directories } = ev.data;
  console.log(files, directories);

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
    if (d.parent && d.parent !== (await explorer.getPathAsString())) {
      await explorer.changeDirectory(`/${d.parent}`);
    }
    await explorer.createDirectory(d.name);
  }

  postMessage(event('progress', { directoriesDone: directories.length }));

  let filesDone = 0;
  for (const f of files) {
    if (f.parent && f.parent !== (await explorer.getPathAsString())) {
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
