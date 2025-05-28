import React from 'react';
import { View, StyleSheet, Image, Text as RNText, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import type { Wallet } from '../../types';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#0B0544',
  balanceCard: '#6EC1E4',
  buttonBlue: '#BFE8F9',
  buttonGray: '#D9D9D9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
};

// Sample bank data
const bankData = {
  'State Bank of India': {
    balance: 45000,
    logo: require('../../../assets/State bank of india.png'),
    accountNumber: 'SBI1234567890',
    transactions: [
      { id: 1, type: 'Expense', amount: 1500, category: 'Food', date: '2024-03-20', description: 'Grocery shopping' },
      { id: 2, type: 'Income', amount: 5000, category: 'Salary', date: '2024-03-19', description: 'Monthly salary' },
    ]
  },
  'Punjab National Bank': {
    balance: 35000,
    logo: require('../../../assets/Punjab national bank.png'),
    accountNumber: 'PNB9876543210',
    transactions: [
      { id: 3, type: 'Expense', amount: 800, category: 'Transport', date: '2024-03-18', description: 'Bus fare' },
      { id: 4, type: 'Expense', amount: 2000, category: 'Shopping', date: '2024-03-17', description: 'New clothes' },
    ]
  },
  'Bank of Baroda': {
    balance: 28000,
    logo: require('../../../assets/Bank of baroda.png'),
    accountNumber: 'BOB5678901234',
    transactions: [
      { id: 5, type: 'Income', amount: 1000, category: 'Freelance', date: '2024-03-16', description: 'Project payment' },
      { id: 6, type: 'Expense', amount: 1200, category: 'Bills', date: '2024-03-15', description: 'Electricity bill' },
    ]
  },
  'Central Bank of India': {
    balance: 32000,
    logo: require('../../../assets/Central bank of india.png'),
    accountNumber: 'CBI3456789012',
    transactions: [
      { id: 7, type: 'Expense', amount: 1500, category: 'Entertainment', date: '2024-03-14', description: 'Movie tickets' },
      { id: 8, type: 'Income', amount: 3000, category: 'Refund', date: '2024-03-13', description: 'Online purchase refund' },
    ]
  }
};

type BudgetCategory = {
  category: string;
  spent: number;
  total: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

// Sample budget data
const budgetCategories: BudgetCategory[] = [
  { category: 'Food', spent: 2500, total: 5000, icon: 'food-fork-drink' },
  { category: 'Transport', spent: 1200, total: 2000, icon: 'bus' },
  { category: 'Entertainment', spent: 800, total: 1500, icon: 'movie-roll' },
  { category: 'Shopping', spent: 3000, total: 4000, icon: 'cart' },
];

type Transaction = {
  id: number;
  type: 'Income' | 'Expense';
  amount: number;
  category: string;
  date: string;
  description: string;
};

type BankInfo = {
  balance: number;
  logo: any;
  accountNumber: string;
  transactions: Transaction[];
};

type BankData = {
  [key: string]: BankInfo;
};

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { items: wallets } = useSelector((state: RootState) => state.wallets) as { items: Wallet[] };
  const { selectedBank } = useSelector((state: RootState) => state.user) as { selectedBank: { name: string; logo: any } | null };
  const bankInfo = selectedBank ? (bankData as BankData)[selectedBank.name] : null;
  const totalBalance = bankInfo?.balance || 0;
  const transactions = bankInfo?.transactions || [];

  const renderProgressBar = (spent: number, total: number) => {
    const progress = spent / total;
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar,
            { 
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: spent > total ? COLORS.expense : COLORS.income 
            }
          ]} 
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo and Bank Info */}
      <View style={styles.logoRow}>
        <Image 
          source={selectedBank?.logo || require('../../../assets/Dogonew.png')} 
          style={styles.logo}
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          defaultSource={require('../../../assets/icon.png')}
        />
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{selectedBank?.name || 'Select a Bank'}</Text>
          <Text style={styles.accountNumber}>A/C: {bankInfo?.accountNumber || 'Not Available'}</Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>Rs. {totalBalance.toFixed(2)}</Text>
        <View style={styles.balanceInfo}>
          <Text style={styles.transactionCount}>Total Transactions: {transactions.length}</Text>
          <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.ovalButton, styles.ovalButtonBlue]}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <RNText style={styles.ovalButtonTextBlack}>ADD{"\n"}Transaction</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ovalButton, styles.ovalButtonGray]}
          onPress={() => navigation.navigate('Transactions')}
        >
          <RNText style={styles.ovalButtonTextBlack}>View All</RNText>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {transactions.map((transaction: Transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.type === 'Income' ? COLORS.income : COLORS.expense }
            ]}>
              {transaction.type === 'Income' ? '+' : '-'}Rs. {transaction.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Budget Overview Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        {budgetCategories.map((budget, index) => (
          <View key={index} style={styles.budgetItem}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetCategoryContainer}>
                <MaterialCommunityIcons 
                  name={budget.icon} 
                  size={24} 
                  color={COLORS.white} 
                  style={styles.budgetIcon}
                />
                <Text style={styles.budgetCategory}>{budget.category}</Text>
              </View>
              <Text style={styles.budgetAmount}>Rs. {budget.spent} / Rs. {budget.total}</Text>
            </View>
            {renderProgressBar(budget.spent, budget.total)}
            <Text style={styles.budgetRemaining}>
              Remaining: Rs. {(budget.total - budget.spent).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  bankInfo: {
    marginLeft: 12,
  },
  bankName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  accountNumber: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.7,
  },
  balanceCard: {
    backgroundColor: COLORS.balanceCard,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    color: COLORS.text,
    fontWeight: '700',
  },
  balanceInfo: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionCount: {
    fontSize: 14,
    color: COLORS.text,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  ovalButton: {
    width: width * 0.45,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  ovalButtonBlue: {
    backgroundColor: COLORS.buttonBlue,
  },
  ovalButtonGray: {
    backgroundColor: COLORS.buttonGray,
  },
  ovalButtonTextBlack: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  seeAllText: {
    color: COLORS.buttonBlue,
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  budgetItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    marginRight: 8,
  },
  budgetCategory: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  budgetAmount: {
    color: COLORS.white,
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetRemaining: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
});

export default HomeScreen; 