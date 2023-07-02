import { configureStore } from '@reduxjs/toolkit';

import player from '~modules/player/playerSlice';

export default configureStore({
  reducer: {
    player,
  },
});
