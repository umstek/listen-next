import { useDispatch, useSelector } from 'react-redux';

import { setActiveIndex } from '~modules/playlist/playlistSlice';
import type { RootState } from '~store';
import { clamp } from '~util/math';

import { Player } from ':Player';

export function PlayerView() {
  const { activeIndex, items } = useSelector(
    (state: RootState) => state.playlist,
  );
  const dispatch = useDispatch();

  const handleNext = () => {
    const newIndex = clamp(activeIndex + 1, 0, items.length - 1);
    dispatch(setActiveIndex(newIndex));
  };

  const handlePrevious = () => {
    const newIndex = clamp(activeIndex - 1, 0, items.length - 1);
    dispatch(setActiveIndex(newIndex));
  };

  return (
    <Player
      item={items[activeIndex] ?? ''}
      onNext={handleNext}
      onPrevious={handlePrevious}
      settings
      metadata
    />
  );
}
