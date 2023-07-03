import { useDispatch } from 'react-redux';

import { setItems } from '~modules/playlist/playlistSlice';

import { FileLoader } from ':FileLoader';

export function FileLoaderView() {
  const dispatch = useDispatch();

  return (
    <FileLoader
      onPlayNow={(files) => {
        const urls = files.map((f) => URL.createObjectURL(f.file));
        dispatch(setItems(urls));
      }}
    />
  );
}
