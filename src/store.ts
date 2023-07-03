import { configureStore } from '@reduxjs/toolkit';

import playlist from '~modules/playlist/playlistSlice';

export default configureStore({
  reducer: {
    playlist,
  },
});
