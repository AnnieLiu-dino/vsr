import { createSlice } from '@reduxjs/toolkit';

const progressSlice = createSlice({
    name: 'progress',
  initialState: {
    progress: 0,
  },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
    },
  },
});

export const { setProgress, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
