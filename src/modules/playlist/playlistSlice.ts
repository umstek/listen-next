import { createSlice } from '@reduxjs/toolkit';

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    items: [] as string[],
    activeIndex: 0,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    appendItems: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    clearItems: (state) => {
      state.items = [];
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setItems, appendItems, clearItems, setActiveIndex } =
  playlistSlice.actions;

export const selectPlaylistState = (state: any) => state.playlist;

export default playlistSlice.reducer;
