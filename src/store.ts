import { configureStore } from '@reduxjs/toolkit';

import player from ':player/playerSlice';

export default configureStore({
  reducer: {
    player,
  },
});
