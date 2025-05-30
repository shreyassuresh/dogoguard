export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  walletId: string;
  walletName: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    currency: string;
  };
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
} 