import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './progress';
import modelReducer from './model';

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    model: modelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查
    }),
});

export type RootState = ReturnType<typeof store.getState>;
