import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Searchbar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import type { Transaction } from '../../types';

const COLORS = {
  background: '#0B0544',
  card: '#6EC1E4',
  accent: '#BFE8F9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const screenWidth = Dimensions.get('window').width;

function getLast7Days() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

// Default sample transactions if Redux is empty
function getSampleDate(daysAgo: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: getSampleDate(6, 9, 15), // 6 days ago, 09:15
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    category: 'Food',
    description: 'Groceries',
    date: getSampleDate(5, 13, 40), // 5 days ago, 13:40
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '3',
    type: 'expense',
    amount: 800,
    category: 'Transport',
    description: 'Cab ride',
    date: getSampleDate(4, 18, 5), // 4 days ago, 18:05
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '4',
    type: 'income',
    amount: 2000,
    category: 'Freelance',
    description: 'Project payment',
    date: getSampleDate(3, 11, 25), // 3 days ago, 11:25
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '5',
    type: 'expense',
    amount: 1500,
    category: 'Shopping',
    description: 'Clothes',
    date: getSampleDate(2, 16, 50), // 2 days ago, 16:50
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '6',
    type: 'expense',
    amount: 600,
    category: 'Bills',
    description: 'Electricity bill',
    date: getSampleDate(1, 8, 10), // 1 day ago, 08:10
    walletId: '1',
    walletName: 'Main Wallet',
  },
  {
    id: '7',
    type: 'income',
    amount: 1000,
    category: 'Gift',
    description: 'Birthday gift',
    date: getSampleDate(0, 20, 30), // today, 20:30
    walletId: '1',
    walletName: 'Main Wallet',
  },
];

type Props = NativeStackScreenProps<MainTabParamList, 'Transactions'>;

const TransactionsScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const { items: transactions } = useSelector((state: RootState) => state.transactions) as { items: Transaction[] };

  // Use default transactions if Redux is empty
  const transactionsToShow = transactions.length > 0 ? transactions : defaultTransactions;

  const filteredTransactions = transactionsToShow.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Bar graph data
  const last7Days = getLast7Days();
  const barData = last7Days.map(day => {
    const dayStr = day.toLocaleDateString();
    const total = filteredTransactions
      .filter(txn => new Date(txn.date).toLocaleDateString() === dayStr)
      .reduce((sum, txn) => sum + txn.amount, 0);
    return { label: daysOfWeek[day.getDay() === 0 ? 6 : day.getDay() - 1], total };
  });
  const maxBar = Math.max(...barData.map(b => Math.abs(b.total)), 1);

  // Flat, sorted transaction list (most recent first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Searchbar
            placeholder="Search transactions"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ color: COLORS.text }}
            iconColor={COLORS.text}
          />
          <View style={styles.filterChips}>
            <Chip
              selected={selectedType === 'all'}
              onPress={() => setSelectedType('all')}
              style={[styles.chip, selectedType === 'all' && styles.chipSelected]}
              textStyle={{ color: selectedType === 'all' ? COLORS.background : COLORS.text }}
            >
              All
            </Chip>
            <Chip
              selected={selectedType === 'income'}
              onPress={() => setSelectedType('income')}
              style={[styles.chip, selectedType === 'income' && styles.chipSelected]}
              textStyle={{ color: selectedType === 'income' ? COLORS.background : COLORS.text }}
            >
              Income
            </Chip>
            <Chip
              selected={selectedType === 'expense'}
              onPress={() => setSelectedType('expense')}
              style={[styles.chip, selectedType === 'expense' && styles.chipSelected]}
              textStyle={{ color: selectedType === 'expense' ? COLORS.background : COLORS.text }}
            >
              Expenses
            </Chip>
          </View>
        </View>

        {/* Bar Graph */}
        <View style={styles.barGraphWrapper}>
          <Text style={styles.barGraphTitle}>Last 7 Days</Text>
          <View style={styles.barGraphContainer}>
            {barData.map((bar, idx) => {
              const barHeight = Math.max(8, Math.min(90, 100 * (Math.abs(bar.total) / maxBar)));
              return (
                <View key={bar.label} style={styles.barItem}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: bar.total >= 0 ? COLORS.accent : COLORS.expense,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{bar.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Flat Transaction List */}
        <Text style={styles.listTitle}>All Transactions</Text>
        <View style={styles.transactionListPad}>
        {sortedTransactions.map((item, idx) => (
          <Card key={item.id || idx} style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                <View>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
                <Text
                  style={[
                    styles.amount,
                    { color: item.type === 'income' ? COLORS.income : COLORS.expense },
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'}Rs. {Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <MaterialCommunityIcons name="wallet" size={22} color="#222" style={styles.walletIcon} />
              </View>
            </Card.Content>
          </Card>
        ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#BFE8F9',
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 1,
  },
  searchBar: {
    marginBottom: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
  },
  filterChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
  },
  chipSelected: {
    backgroundColor: COLORS.white,
  },
  barGraphWrapper: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  barGraphTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 4,
  },
  barGraphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 22,
    borderRadius: 8,
    marginBottom: 6,
  },
  barLabel: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  listTitle: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 16,
  },
  transactionCard: {
    marginBottom: 10,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    elevation: 2,
    marginHorizontal: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  category: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  date: {
    color: COLORS.white,
    fontSize: 13,
    opacity: 0.8,
  },
  walletIcon: {
    marginLeft: 8,
    backgroundColor: '#BFE8F9',
    borderRadius: 12,
    padding: 2,
  },
  transactionListPad: {
    paddingTop: 8,
  },
});

export default TransactionsScreen; 