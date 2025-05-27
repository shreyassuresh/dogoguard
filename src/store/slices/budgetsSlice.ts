import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget } from '../../types';

interface BudgetsState {
  items: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetsState = {
  items: [],
  loading: false,
  error: null,
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.items.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.items = action.payload;
    },
    updateSpent: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const budget = state.items.find(item => item.id === action.payload.id);
      if (budget) {
        budget.spent += action.payload.amount;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addBudget,
  updateBudget,
  deleteBudget,
  setBudgets,
  updateSpent,
  setLoading,
  setError,
} = budgetsSlice.actions;

export default budgetsSlice.reducer; 