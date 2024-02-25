import { createSlice } from '@reduxjs/toolkit';

import { PlaylistItem, playlistSchema } from '~models/Playlist';

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: playlistSchema.parse({}),
  reducers: {
    createFromItems: (state, action: { payload: PlaylistItem[] }) => {
      state = playlistSchema.parse({ items: action.payload });
      return state;
    },
    setName: (state, action: { payload: string }) => {
      state.name = action.payload;
    },
    setItems: (state, action: { payload: PlaylistItem[] }) => {
      state.items = action.payload;
    },
    insertItemsAt: (
      state,
      action: { payload: { index?: number; items: PlaylistItem[] } },
    ) => {
      state.items.splice(
        action.payload.index || state.activeIndex + 1,
        0,
        ...action.payload.items,
      );
    },
    appendItems: (state, action: { payload: PlaylistItem[] }) => {
      state.items.push(...action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
    setActiveIndex: (state, action: { payload: number }) => {
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
