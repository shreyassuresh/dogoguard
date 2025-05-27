import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import walletsReducer from './slices/walletsSlice';
import budgetsReducer from './slices/budgetsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    wallets: walletsReducer,
    budgets: budgetsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 