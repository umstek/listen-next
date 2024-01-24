import { createSlice } from '@reduxjs/toolkit';

import { playlistSchema } from '~models/Playlist';

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: playlistSchema.parse({}),
  reducers: {
    createFromItems: (state, action) => {
      state = playlistSchema.parse({ items: action.payload });
      return state;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    insertItemsAt: (state, action) => {
      state.items.splice(
        action.payload.index || state.activeIndex + 1,
        0,
        ...action.payload.items,
      );
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
  // DO NOT specify selectors here as they assume there is only this slice.
});

export const {
  createFromItems,
  setName,
  setItems,
  insertItemsAt,
  appendItems,
  clearItems,
  setActiveIndex,
} = playlistSlice.actions;

export default playlistSlice.reducer;
