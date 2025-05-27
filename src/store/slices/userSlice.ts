import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  selectedBank?: {
    name: string;
    logo: any;
  } | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  selectedBank: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
      }
    },
    setSelectedBank: (state, action: PayloadAction<{ name: string; logo: any } | null>) => {
      state.selectedBank = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.selectedBank = null;
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
  setUser,
  updateUserPreferences,
  setSelectedBank,
  clearUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer; 