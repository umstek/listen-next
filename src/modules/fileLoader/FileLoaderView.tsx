import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { db } from '~lib/db';
import { Explorer } from '~lib/explorer';
import IndexAndCopyWorker from '~lib/workers/indexAndCopyTask?worker';
import {
  directoryMetadataSchema,
  fileMetadataSchema,
} from '~models/FileMetadata';
import { setItems } from '~modules/playlist/playlistSlice';
import { addTask, updateTask } from '~modules/tasks/tasksSlice';

import { FileLoader } from ':FileLoader';

const worker = new IndexAndCopyWorker();

/**
 * Renders the FileLoaderView component.
 */
export function FileLoaderView() {
  const dispatch = useDispatch();
  const explorerRef = useRef(new Explorer());

  return (
    <FileLoader
      onPlayNow={(files) => {
        const urls = files.map((f) => URL.createObjectURL(f.file));
        dispatch(setItems(urls));
      }}
      onCopy={async ({ files, directories }) => {
        const id = nanoid();
        worker.onmessage = (
          message: MessageEvent<{
            task: string;
            id: string;
            action: string;
            [key: string]: unknown;
          }>,
        ) => {
          switch (message.data.action) {
            case 'start':
              dispatch(
                addTask({
                  display: 'Copying and indexing',
                  id,
                  partsCount: message.data.filesTotal as number,
                  partsDone: 0,
                  status: 'pending',
                }),
              );
              break;
            case 'progress':
              dispatch(
                updateTask({
                  id,
                  partsDone: message.data.filesDone as number,
                  status: 'in-progress',
                }),
              );
              break;
            case 'done':
              dispatch(
                updateTask({
                  id,
                  partsDone: message.data.filesDone as number,
                  status: 'success',
                }),
              );
              break;
          }
        };
        worker.postMessage({ id: nanoid(), files, directories });
      }}
      onLink={async ({ files, directories }) => {
        const orphans = [
          ...directories.filter((d) => !d.parent),
          ...files.filter((f) => !f.parent),
        ];

        const dbos = orphans.map((o) => {
          const schema =
            o.kind === 'file' ? fileMetadataSchema : directoryMetadataSchema;
          return schema.parse({
            name: o.name,
            kind: o.kind,
            source: 'local',
            locator: o.handle,
          });
        });

        await db.linkedFSEs.bulkPut(dbos);

        explorerRef.current.changeDirectory('/');
        for (const dbo of dbos) {
          const data = { id: dbo.id };
          const json = JSON.stringify(data);
          const file = new File(
            [json],
            `@link-${dbo.source}-${dbo.kind}:${dbo.name}`,
            {
              type: 'application/json',
            },
          );
          explorerRef.current.putFile(file);
        }
      }}
    />
  );
}
