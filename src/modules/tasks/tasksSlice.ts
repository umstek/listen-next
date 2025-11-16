import type { TaskStatusDefinition } from ':TaskStatusDisplay/TaskStatusDisplay'
import { createSlice } from '@reduxjs/toolkit'

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [] as TaskStatusDefinition[],
  },
  reducers: {
    addTask: (state, action: { payload: TaskStatusDefinition }) => {
      state.items.push(action.payload)
    },
    removeTask: (state, action: { payload: string }) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateTask: (state, action: { payload: Partial<TaskStatusDefinition> }) => {
      const task = state.items.find((item) => item.id === action.payload.id)
      if (task) {
        Object.assign(task, action.payload)
      }
    },
  },
})

export const { addTask, updateTask, removeTask } = tasksSlice.actions

export default tasksSlice.reducer
