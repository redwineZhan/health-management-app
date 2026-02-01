import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import healthReducer from './store/healthSlice';
import weightLossReducer from './store/weightLossSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
    weightLoss: weightLossReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;