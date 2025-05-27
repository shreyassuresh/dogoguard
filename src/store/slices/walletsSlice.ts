import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../types';

interface WalletsState {
  items: Wallet[];
  loading: boolean;
  error: string | null;
}

const initialState: WalletsState = {
  items: [],
  loading: false,
  error: null,
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<Wallet>) => {
      state.items.push(action.payload);
    },
    updateWallet: (state, action: PayloadAction<Wallet>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteWallet: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.items = action.payload;
    },
    updateBalance: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const wallet = state.items.find(item => item.id === action.payload.id);
      if (wallet) {
        wallet.balance += action.payload.amount;
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
  addWallet,
  updateWallet,
  deleteWallet,
  setWallets,
  updateBalance,
  setLoading,
  setError,
} = walletsSlice.actions;

export default walletsSlice.reducer; 