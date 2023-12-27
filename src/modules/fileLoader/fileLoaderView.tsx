import { useDispatch } from 'react-redux';

import { setItems } from '~modules/playlist/playlistSlice';

import { FileLoader } from ':FileLoader';
import { useRef } from 'react';
import { Explorer } from '~lib/Explorer';
import { db } from '~lib/db';
import { fileSystemEntitySchema } from '~models/FileSystemEntity';

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
          if (d.parent && d.parent !== (await explorerRef.current.pwd())) {
            await explorerRef.current.cd(`/${d.parent}`);
          }
          await explorerRef.current.mkdir(d.name);
        }

        for (const f of files) {
          if (f.parent && f.parent !== (await explorerRef.current.pwd())) {
            await explorerRef.current.cd(`/${f.parent}`);
          }
          await explorerRef.current.put(f.file);
        }

        await explorerRef.current.cd('/');
      }}
      onLink={async ({ files, directories }) => {}}
    />
  );
}
