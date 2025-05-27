import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB, Portal, Dialog, TextInput, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import { addBudget } from '../../store/slices/budgetsSlice';
import type { Budget } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'Budgets'>;

const BudgetsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { items: budgets } = useSelector((state: RootState) => state.budgets) as { items: Budget[] };

  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleAddBudget = async () => {
    if (!category || !amount) {
      // TODO: Show error message
      return;
    }

    setLoading(true);
    try {
      const budget: Omit<Budget, 'id'> = {
        category,
        amount: parseFloat(amount),
        spent: 0,
        period,
        startDate: new Date(),
      };

      dispatch(addBudget(budget as Budget));
      setVisible(false);
      setCategory('');
      setAmount('');
      setPeriod('monthly');
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Budgets
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
                      width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                      backgroundColor:
                        budget.spent > budget.amount ? '#B00020' : '#6200ee',
                    },
                  ]}
                />
              </View>
              <Text variant="bodySmall" style={styles.period}>
                {budget.period}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Add Budget</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              style={styles.input}
              keyboardType="decimal-pad"
              left={<TextInput.Affix text="$" />}
            />
            <Text variant="bodyMedium" style={styles.periodLabel}>
              Period
            </Text>
            <SegmentedButtons
              value={period}
              onValueChange={value => setPeriod(value as typeof period)}
              buttons={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button
              onPress={handleAddBudget}
              loading={loading}
              disabled={loading}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
      />
    </View>
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
  title: {
    marginBottom: 24,
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
  period: {
    marginTop: 8,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  periodLabel: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default BudgetsScreen; 