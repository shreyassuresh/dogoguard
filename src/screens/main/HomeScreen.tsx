import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import type { Transaction, Wallet, Budget } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { items: transactions } = useSelector((state: RootState) => state.transactions) as { items: Transaction[] };
  const { items: wallets } = useSelector((state: RootState) => state.wallets) as { items: Wallet[] };
  const { items: budgets } = useSelector((state: RootState) => state.budgets) as { items: Budget[] };

  const totalBalance = wallets.reduce((sum: number, wallet: Wallet) => sum + wallet.balance, 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Hello, {currentUser?.name}!
        </Text>

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Balance</Text>
            <Text variant="displaySmall" style={styles.balance}>
              ${totalBalance.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddTransaction')}
            style={styles.actionButton}
          >
            Add Transaction
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Transactions')}
            style={styles.actionButton}
          >
            View All
          </Button>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Recent Transactions
        </Text>

        {recentTransactions.map(transaction => (
          <Card key={transaction.id} style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                <Text variant="titleMedium">{transaction.category}</Text>
                <Text
                  variant="titleMedium"
                  style={{
                    color: transaction.type === 'income' ? theme.colors.primary : theme.colors.error,
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
              <Text variant="bodyMedium">{transaction.description}</Text>
              <Text variant="bodySmall" style={styles.date}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Budget Overview
        </Text>

        {budgets.map(budget => (
          <Card key={budget.id} style={styles.budgetCard}>
            <Card.Content>
              <View style={styles.budgetHeader}>
                <Text variant="titleMedium">{budget.category}</Text>
                <Text variant="titleMedium">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(budget.spent / budget.amount) * 100}%`,
                      backgroundColor:
                        budget.spent > budget.amount ? theme.colors.error : theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  greeting: {
    marginBottom: 24,
  },
  balanceCard: {
    marginBottom: 24,
  },
  balance: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    marginTop: 4,
    opacity: 0.7,
  },
  budgetCard: {
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default HomeScreen; 