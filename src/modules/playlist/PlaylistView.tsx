import { useSelector } from 'react-redux';

import { RootState } from '~store';

import { Playlist } from ':Playlist';

export function PlaylistView() {
  const { activeIndex, items } = useSelector(
    (state: RootState) => state.playlist,
  );

  return <Playlist items={items} />;
}
