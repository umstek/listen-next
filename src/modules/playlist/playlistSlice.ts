import { createSlice } from '@reduxjs/toolkit';

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlist: [] as string[],
    activeIndex: 0,
  },
  reducers: {
    setItems: (state, action) => {
      state.playlist = action.payload;
    },
    clearItems: (state) => {
      state.playlist = [];
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setItems, clearItems, setActiveIndex } = playlistSlice.actions;

export const selectPlaylistState = (state: any) => state.playlist;

export default playlistSlice.reducer;
