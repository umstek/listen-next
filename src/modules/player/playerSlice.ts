import { createSlice } from '@reduxjs/toolkit';

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    url: '',
  },
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    clearUrl: (state) => {
      state.url = '';
    },
  },
});

export const { setUrl, clearUrl } = playerSlice.actions;

export const selectPlayerState = (state: any) => state.player;

export default playerSlice.reducer;
