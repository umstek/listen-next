import { useDispatch, useSelector } from 'react-redux';

import { clamp } from '~util/math';
import {
  setActiveIndex,
  selectPlaylistState,
} from '~modules/playlist/playlistSlice';

import { Player } from ':Player';

export function PlayerView() {
  const playlistState = useSelector(selectPlaylistState);
  const dispatch = useDispatch();

  const url = playlistState.playlist?.[playlistState.activeIndex] || '';

  const handleNext = () => {
    const newIndex = clamp(
      playlistState.activeIndex + 1,
      0,
      (playlistState.playlist?.length ?? 1) - 1,
    );
    dispatch(setActiveIndex(newIndex));
  };

  const handlePrevious = () => {
    const newIndex = clamp(
      playlistState.activeIndex - 1,
      0,
      (playlistState.playlist?.length ?? 1) - 1,
    );
    dispatch(setActiveIndex(newIndex));
  };

  return (
    <Player
      url={url}
      onNext={handleNext}
      onPrevious={handlePrevious}
      settings
      metadata
    />
  );
}
