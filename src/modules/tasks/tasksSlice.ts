import { createSlice } from '@reduxjs/toolkit';

import { TaskStatusDefinition } from ':TaskStatusDisplay/TaskStatusDisplay';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [] as TaskStatusDefinition[],
  },
  reducers: {
    addTask: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateTask: (state, action) => {
      state.items = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
    },
  },
});

export const { addTask, removeTask } = tasksSlice.actions;

export const selectPlaylistState = (state: any) => state.playlist;

export default tasksSlice.reducer;
