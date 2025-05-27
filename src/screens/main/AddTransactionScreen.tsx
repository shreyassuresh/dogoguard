import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Portal, Dialog, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import { addTransaction } from '../../store/slices/transactionsSlice';
import type { Transaction, Wallet } from '../../types';

type Props = NativeStackScreenProps<MainTabParamList, 'AddTransaction'>;

const AddTransactionScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { items: wallets } = useSelector((state: RootState) => state.wallets) as { items: Wallet[] };

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletDialogVisible, setWalletDialogVisible] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !category || !description || !walletId) {
      // TODO: Show error message
      return;
    }

    setLoading(true);
    try {
      const selectedWallet = wallets.find(w => w.id === walletId);
      if (!selectedWallet) {
        throw new Error('Selected wallet not found');
      }

      const transaction: Omit<Transaction, 'id'> = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        walletId,
        walletName: selectedWallet.name,
        date: new Date().toISOString(),
      };

      dispatch(addTransaction(transaction as Transaction));
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedWallet = wallets.find(w => w.id === walletId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Add Transaction
        </Text>

        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as 'income' | 'expense')}
          buttons={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          style={styles.segmentedButtons}
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

        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          multiline
        />

        <TextInput
          label="Wallet"
          value={selectedWallet?.name || ''}
          mode="outlined"
          style={styles.input}
          onPressIn={() => setWalletDialogVisible(true)}
          editable={false}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Add Transaction
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={walletDialogVisible} onDismiss={() => setWalletDialogVisible(false)}>
          <Dialog.Title>Select Wallet</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {wallets.map(wallet => (
                <List.Item
                  key={wallet.id}
                  title={wallet.name}
                  description={`Balance: $${wallet.balance.toFixed(2)}`}
                  onPress={() => {
                    setWalletId(wallet.id);
                    setWalletDialogVisible(false);
                  }}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setWalletDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
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
  segmentedButtons: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});

export default AddTransactionScreen; 