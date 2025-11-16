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
      state.activeIndex = 0; // Reset to first item when setting new playlist
    },
    appendItems: (state, action) => {
      state.items.push(...action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
  },
  // Redux is dumb. Types aren't right when code is right and vice versa.
  // selectors: {
  //   playlist: (state) => state.playlist.items || [],
  //   activeIndex: (state) => state.playlist.activeIndex || 0,
  //   activeItem: (state) => state.playlist.items[state.activeIndex] || '',
  // },
});

export const { setItems, appendItems, clearItems, setActiveIndex } =
  playlistSlice.actions;

export default playlistSlice.reducer;
