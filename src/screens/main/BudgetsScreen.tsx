import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, FAB, Portal, Dialog, TextInput, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import { addBudget } from '../../store/slices/budgetsSlice';
import type { Budget } from '../../types';
import { PieChart } from 'react-native-chart-kit';

type Props = NativeStackScreenProps<MainTabParamList, 'Budgets'>;

const COLORS = {
  background: '#0B0544',
  card: '#6EC1E4',
  accent: '#BFE8F9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
  chartColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  cardBackground: 'rgba(110, 193, 228, 0.1)',
  dialogBackground: '#1A1A2E',
  dialogCard: 'rgba(255, 255, 255, 0.1)',
  warning: '#FFA726',
  success: '#4CAF50',
  danger: '#FF5252',
};

const screenWidth = Dimensions.get('window').width;

// Sample budget data for demonstration
const sampleBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    amount: 5000,
    spent: 3200,
    period: 'monthly',
    startDate: new Date(),
  },
  {
    id: '2',
    category: 'Transportation',
    amount: 2000,
    spent: 1500,
    period: 'monthly',
    startDate: new Date(),
  },
  {
    id: '3',
    category: 'Shopping',
    amount: 3000,
    spent: 2800,
    period: 'monthly',
    startDate: new Date(),
  },
  {
    id: '4',
    category: 'Bills & Utilities',
    amount: 4000,
    spent: 3800,
    period: 'monthly',
    startDate: new Date(),
  },
  {
    id: '5',
    category: 'Entertainment',
    amount: 1500,
    spent: 1200,
    period: 'monthly',
    startDate: new Date(),
  },
];

// Money saving tips based on spending patterns
const getMoneySavingTips = (budgets: Budget[]) => {
  const tips = [];
  const overspentCategories = budgets.filter(b => b.spent > b.amount);
  
  if (overspentCategories.length > 0) {
    tips.push({
      icon: 'alert-circle' as const,
      title: 'Overspending Alert',
      description: `You've exceeded your budget in ${overspentCategories.length} categories. Consider reviewing your spending habits.`
    });
  }

  const highestSpending = budgets.reduce((max, curr) => 
    curr.spent > max.spent ? curr : max
  , budgets[0]);

  if (highestSpending) {
    tips.push({
      icon: 'chart-line' as const,
      title: 'Highest Spending',
      description: `Your highest spending is in ${highestSpending.category}. Look for ways to optimize expenses in this category.`
    });
  }

  tips.push({
    icon: 'lightbulb' as const,
    title: 'Smart Saving Tip',
    description: 'Consider setting up automatic transfers to a savings account right after receiving your income.'
  });

  return tips;
};

const BudgetsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { items: budgets } = useSelector((state: RootState) => state.budgets) as { items: Budget[] };
  
  // Use sample budgets if no budgets exist
  const displayBudgets = budgets.length > 0 ? budgets : sampleBudgets;

  const [visible, setVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  // Calculate total budget and spent amount
  const totalBudget = useMemo(() => 
    displayBudgets.reduce((sum, budget) => sum + budget.amount, 0),
    [displayBudgets]
  );

  const totalSpent = useMemo(() => 
    displayBudgets.reduce((sum, budget) => sum + budget.spent, 0),
    [displayBudgets]
  );

  // Prepare data for pie chart
  const pieChartData = useMemo(() => 
    displayBudgets.map((budget, index) => ({
      name: budget.category,
      amount: budget.spent,
      color: COLORS.chartColors[index % COLORS.chartColors.length],
      legendFontColor: COLORS.white,
      legendFontSize: 12,
    })),
    [displayBudgets]
  );

  const moneySavingTips = useMemo(() => getMoneySavingTips(displayBudgets), [displayBudgets]);

  const handleAddBudget = async () => {
    if (!category || !amount) {
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

  const handleBudgetPress = (budget: Budget) => {
    setSelectedBudget(budget);
  };

  const getBudgetInsights = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    const daysInPeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    }[budget.period];

    const dailyAverage = budget.spent / daysInPeriod;
    const remainingDaily = remaining / daysInPeriod;

    return {
      percentage,
      remaining,
      dailyAverage,
      remainingDaily,
      status: percentage > 100 ? 'Overspent' : percentage > 80 ? 'Warning' : 'Good',
      statusColor: percentage > 100 ? COLORS.expense : percentage > 80 ? '#FFA726' : COLORS.income
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text variant="headlineMedium" style={styles.title}>
          Budget Analysis
        </Text>

        {/* Overview Card */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <View style={styles.overviewHeader}>
              <View>
                <Text style={styles.overviewLabel}>Total Budget</Text>
                <Text style={styles.overviewAmount}>Rs. {totalBudget.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.overviewLabel}>Total Spent</Text>
                <Text style={[
                  styles.overviewAmount,
                  { color: totalSpent > totalBudget ? COLORS.expense : COLORS.income }
                ]}>
                  Rs. {totalSpent.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                    backgroundColor: totalSpent > totalBudget ? COLORS.expense : COLORS.accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.remainingText}>
              Remaining: Rs. {(totalBudget - totalSpent).toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        {/* Spending Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Spending Distribution</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={screenWidth - 80}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="0"
                center={[(screenWidth - 80) / 4, 0]}
                absolute
                hasLegend={false}
                avoidFalseZero
              />
            </View>
            <View style={styles.chartLegend}>
              {pieChartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <View style={styles.legendTextContainer}>
                    <Text style={styles.legendText}>{item.name}</Text>
                    <Text style={styles.legendAmount}>Rs. {item.amount.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.legendPercentage}>
                    {((item.amount / totalSpent) * 100).toFixed(1)}%
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Money Saving Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Smart Tips</Text>
            {moneySavingTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <MaterialCommunityIcons name={tip.icon} size={24} color={COLORS.accent} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Budget List */}
        <Text style={styles.sectionTitle}>Your Budgets</Text>
        {displayBudgets.map(budget => (
          <Card 
            key={budget.id} 
            style={styles.budgetCard}
            onPress={() => handleBudgetPress(budget)}
          >
            <Card.Content>
              <View style={styles.budgetHeader}>
                <View style={styles.budgetCategoryContainer}>
                  <MaterialCommunityIcons 
                    name={getCategoryIcon(budget.category)} 
                    size={24} 
                    color={COLORS.accent} 
                    style={styles.budgetIcon}
                  />
                  <Text 
                    style={styles.category}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {budget.category}
                  </Text>
                </View>
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
              <View style={styles.budgetFooter}>
                <Text style={styles.period}>{budget.period}</Text>
                <Text style={styles.remainingText}>
                  Remaining: Rs. {(budget.amount - budget.spent).toFixed(2)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Detailed Budget Dialog */}
      <Portal>
        <Dialog 
          visible={!!selectedBudget} 
          onDismiss={() => setSelectedBudget(null)}
          style={styles.dialog}
        >
          {selectedBudget && (
            <>
              <Dialog.Title style={styles.dialogTitle}>
                <View style={styles.dialogTitleContainer}>
                  <MaterialCommunityIcons 
                    name={getCategoryIcon(selectedBudget.category)} 
                    size={28} 
                    color={COLORS.accent} 
                    style={styles.dialogIcon}
                  />
                  <Text style={styles.dialogTitleText}>{selectedBudget.category}</Text>
                </View>
              </Dialog.Title>
              <Dialog.Content>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Budget</Text>
                    <Text style={[styles.detailValue, { color: COLORS.accent }]}>
                      Rs. {selectedBudget.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount Spent</Text>
                    <Text style={[styles.detailValue, { color: COLORS.expense }]}>
                      Rs. {selectedBudget.spent.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Remaining</Text>
                    <Text style={[
                      styles.detailValue,
                      { color: getBudgetInsights(selectedBudget).statusColor }
                    ]}>
                      Rs. {getBudgetInsights(selectedBudget).remaining.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Daily Average</Text>
                    <Text style={[styles.detailValue, { color: COLORS.accent }]}>
                      Rs. {getBudgetInsights(selectedBudget).dailyAverage.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Remaining Daily</Text>
                    <Text style={[styles.detailValue, { color: COLORS.income }]}>
                      Rs. {getBudgetInsights(selectedBudget).remainingDaily.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getBudgetInsights(selectedBudget).statusColor + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getBudgetInsights(selectedBudget).statusColor }
                      ]}>
                        {getBudgetInsights(selectedBudget).status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.insightsContainer}>
                  <Text style={styles.insightsTitle}>Insights</Text>
                  {getBudgetInsights(selectedBudget).status === 'Overspent' && (
                    <View style={[styles.insightCard, { backgroundColor: COLORS.danger + '20' }]}>
                      <Text style={[styles.insightText, { color: COLORS.danger }]}>
                        ⚠️ You've exceeded your budget. Consider reviewing your spending habits in this category.
                      </Text>
                    </View>
                  )}
                  {getBudgetInsights(selectedBudget).status === 'Warning' && (
                    <View style={[styles.insightCard, { backgroundColor: COLORS.warning + '20' }]}>
                      <Text style={[styles.insightText, { color: COLORS.warning }]}>
                        ⚠️ You're close to exceeding your budget. Try to reduce spending in this category.
                      </Text>
                    </View>
                  )}
                  {getBudgetInsights(selectedBudget).status === 'Good' && (
                    <View style={[styles.insightCard, { backgroundColor: COLORS.success + '20' }]}>
                      <Text style={[styles.insightText, { color: COLORS.success }]}>
                        ✅ Your spending is within budget. Keep up the good work!
                      </Text>
                    </View>
                  )}
                  <View style={[styles.insightCard, { backgroundColor: COLORS.accent + '20' }]}>
                    <Text style={[styles.insightText, { color: COLORS.accent }]}>
                      💡 Daily average spending: Rs. {getBudgetInsights(selectedBudget).dailyAverage.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button 
                  onPress={() => setSelectedBudget(null)}
                  textColor={COLORS.accent}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>

      {/* Add Budget Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            <View style={styles.dialogTitleContainer}>
              <MaterialCommunityIcons name="plus-circle" size={28} color={COLORS.accent} style={styles.dialogIcon} />
              <Text style={styles.dialogTitleText}>Add New Budget</Text>
            </View>
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.inputContainer}>
              <TextInput
                label="Category"
                value={category}
                onChangeText={setCategory}
                mode="outlined"
                style={styles.input}
                theme={{ 
                  colors: { 
                    text: COLORS.white,
                    primary: COLORS.accent,
                    background: COLORS.dialogCard
                  } 
                }}
                outlineColor={COLORS.accent}
                activeOutlineColor={COLORS.accent}
                textColor={COLORS.white}
              />
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                style={styles.input}
                keyboardType="decimal-pad"
                left={<TextInput.Affix text="Rs." />}
                theme={{ 
                  colors: { 
                    text: COLORS.white,
                    primary: COLORS.accent,
                    background: COLORS.dialogCard
                  } 
                }}
                outlineColor={COLORS.accent}
                activeOutlineColor={COLORS.accent}
                textColor={COLORS.white}
              />
              <Text variant="bodyMedium" style={styles.periodLabel}>
                Budget Period
              </Text>
              <SegmentedButtons
                value={period}
                onValueChange={value => setPeriod(value as typeof period)}
                buttons={[
                  { 
                    value: 'daily', 
                    label: 'Daily',
                    style: { backgroundColor: period === 'daily' ? COLORS.accent + '20' : 'transparent' }
                  },
                  { 
                    value: 'weekly', 
                    label: 'Weekly',
                    style: { backgroundColor: period === 'weekly' ? COLORS.accent + '20' : 'transparent' }
                  },
                  { 
                    value: 'monthly', 
                    label: 'Monthly',
                    style: { backgroundColor: period === 'monthly' ? COLORS.accent + '20' : 'transparent' }
                  },
                  { 
                    value: 'yearly', 
                    label: 'Yearly',
                    style: { backgroundColor: period === 'yearly' ? COLORS.accent + '20' : 'transparent' }
                  },
                ]}
                style={styles.segmentedButtons}
                theme={{ colors: { secondaryContainer: COLORS.accent } }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setVisible(false)} 
              textColor={COLORS.white}
              style={styles.dialogButton}
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddBudget}
              loading={loading}
              disabled={loading || !category || !amount}
              buttonColor={COLORS.accent}
              textColor={COLORS.background}
              style={styles.dialogButton}
            >
              Add Budget
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

// Helper function to get category icons
const getCategoryIcon = (category: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const icons: { [key: string]: keyof typeof MaterialCommunityIcons.glyphMap } = {
    'Food & Dining': 'food-fork-drink',
    'Transportation': 'bus',
    'Shopping': 'cart',
    'Bills & Utilities': 'lightning-bolt',
    'Entertainment': 'movie-roll',
  };
  return icons[category] || 'tag';
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
  overviewCard: {
    marginBottom: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  overviewAmount: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  remainingText: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
  chartCard: {
    marginBottom: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    elevation: 3,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartLegend: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    borderRadius: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  legendAmount: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  legendPercentage: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsCard: {
    marginBottom: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(191, 232, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  budgetCard: {
    marginBottom: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 40,
  },
  budgetCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    maxWidth: '60%',
  },
  budgetIcon: {
    marginRight: 8,
  },
  category: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  amount: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    flexShrink: 0,
    minWidth: '40%',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  period: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 12,
    opacity: 0.9,
  },
  input: {
    backgroundColor: COLORS.dialogCard,
    borderRadius: 10,
  },
  periodLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
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
    backgroundColor: COLORS.dialogBackground,
    borderRadius: 16,
    padding: 16,
  },
  dialogTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogIcon: {
    marginRight: 12,
  },
  dialogTitleText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: COLORS.dialogCard,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.9,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  insightsContainer: {
    gap: 12,
  },
  insightsTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
  },
  insightText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 8,
  },
  inputContainer: {
    gap: 16,
  },
  dialogButton: {
    marginHorizontal: 8,
  },
});

export default BudgetsScreen; 