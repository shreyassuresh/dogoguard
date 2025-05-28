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

const COLORS = {
  background: '#0B0544',
  card: '#6EC1E4',
  accent: '#BFE8F9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
};

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
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text variant="headlineMedium" style={styles.title}>
          Budgets
        </Text>

        {budgets.map(budget => (
          <Card key={budget.id} style={styles.budgetCard}>
            <Card.Content>
              <View style={styles.budgetHeader}>
                <Text style={styles.category}>{budget.category}</Text>
                <Text style={styles.amount}>
                  Rs. {budget.spent.toFixed(2)} / Rs. {budget.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                      backgroundColor:
                        budget.spent > budget.amount ? COLORS.expense : COLORS.accent,
                    },
                  ]}
                />
              </View>
              <Text style={styles.period}>{budget.period}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Add Budget</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: COLORS.text, primary: COLORS.accent } }}
            />
            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              style={styles.input}
              keyboardType="decimal-pad"
              left={<TextInput.Affix text="Rs." />}
              theme={{ colors: { text: COLORS.text, primary: COLORS.accent } }}
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
            <Button onPress={() => setVisible(false)} textColor={COLORS.expense}>Cancel</Button>
            <Button
              onPress={handleAddBudget}
              loading={loading}
              disabled={loading}
              buttonColor={COLORS.accent}
              textColor={COLORS.text}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        color={COLORS.background}
        customSize={56}
        onPress={() => setVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
    letterSpacing: 1,
  },
  budgetCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  amount: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  period: {
    marginTop: 8,
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 13,
    opacity: 0.9,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  periodLabel: {
    marginBottom: 8,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 28,
    elevation: 4,
  },
  dialog: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
  },
  dialogTitle: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
});

export default BudgetsScreen; 