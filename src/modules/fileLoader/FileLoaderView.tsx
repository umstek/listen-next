import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Explorer } from '~lib/Explorer';
import { db } from '~lib/db';
import {
  directoryMetadataSchema,
  fileMetadataSchema,
} from '~models/FileMetadata';
import { setItems } from '~modules/playlist/playlistSlice';

import { FileLoader } from ':FileLoader';

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
        for (const d of directories) {
          if (
            d.parent &&
            d.parent !== (await explorerRef.current.getPathAsString())
          ) {
            await explorerRef.current.changeDirectory(`/${d.parent}`);
          }
          await explorerRef.current.createDirectory(d.name);
        }

        for (const f of files) {
          if (
            f.parent &&
            f.parent !== (await explorerRef.current.getPathAsString())
          ) {
            await explorerRef.current.changeDirectory(`/${f.parent}`);
          }
          await explorerRef.current.putFile(f.file);
        }

        await explorerRef.current.changeDirectory('/');
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
