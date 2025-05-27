import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Chip, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import type { Transaction } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'Transactions'>;

const TransactionsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const { items: transactions } = useSelector((state: RootState) => state.transactions) as { items: Transaction[] };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View>
            <Text variant="titleMedium">{item.category}</Text>
            <Text variant="bodyMedium">{item.description}</Text>
          </View>
          <Text
            variant="titleMedium"
            style={{
              color: item.type === 'income' ? theme.colors.primary : theme.colors.error,
            }}
          >
            {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
        <View style={styles.transactionFooter}>
          <Text variant="bodySmall">{new Date(item.date).toLocaleDateString()}</Text>
          <Chip mode="outlined" style={styles.walletChip}>
            {item.walletName}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search transactions"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filterChips}>
          <Chip
            selected={selectedType === 'all'}
            onPress={() => setSelectedType('all')}
            style={styles.chip}
          >
            All
          </Chip>
          <Chip
            selected={selectedType === 'income'}
            onPress={() => setSelectedType('income')}
            style={styles.chip}
          >
            Income
          </Chip>
          <Chip
            selected={selectedType === 'expense'}
            onPress={() => setSelectedType('expense')}
            style={styles.chip}
          >
            Expenses
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    marginHorizontal: 4,
  },
  list: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletChip: {
    height: 24,
  },
});

export default TransactionsScreen; 