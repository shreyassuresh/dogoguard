import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Switch, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import { updateUserPreferences, clearUser } from '../../store/slices/userSlice';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

const COLORS = {
  background: '#0B0544',
  card: '#6EC1E4',
  accent: '#BFE8F9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
};

const ProfileScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleToggleNotifications = () => {
    if (currentUser) {
      dispatch(
        updateUserPreferences({
          ...currentUser.preferences,
          notifications: !currentUser.preferences.notifications,
        })
      );
    }
  };

  const handleToggleTheme = () => {
    if (currentUser) {
      dispatch(
        updateUserPreferences({
          ...currentUser.preferences,
          theme: currentUser.preferences.theme === 'light' ? 'dark' : 'light',
        })
      );
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.name}>
              {currentUser.name}
            </Text>
            <Text variant="bodyLarge" style={styles.email}>
              {currentUser.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Settings
            </Text>

            <List.Section>
              <List.Item
                title="Notifications"
                titleStyle={styles.listTitle}
                right={() => (
                  <Switch
                    value={currentUser.preferences.notifications}
                    onValueChange={handleToggleNotifications}
                    color={COLORS.accent}
                  />
                )}
              />
              <List.Item
                title="Dark Theme"
                titleStyle={styles.listTitle}
                right={() => (
                  <Switch
                    value={currentUser.preferences.theme === 'dark'}
                    onValueChange={handleToggleTheme}
                    color={COLORS.accent}
                  />
                )}
              />
              <List.Item
                title="Currency"
                titleStyle={styles.listTitle}
                description={currentUser.preferences.currency}
                descriptionStyle={styles.listDescription}
                onPress={() => {
                  // TODO: Show currency picker
                }}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Actions
            </Text>

            <Button
              mode="outlined"
              onPress={() => {
                // TODO: Show export data dialog
              }}
              style={styles.actionButton}
              textColor={COLORS.background}
              buttonColor={COLORS.accent}
            >
              Export Data
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                // TODO: Show delete account dialog
              }}
              style={styles.actionButton}
              textColor={COLORS.expense}
              buttonColor={COLORS.white}
            >
              Delete Account
            </Button>

            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor={COLORS.expense}
              textColor={COLORS.white}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
  profileCard: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    elevation: 3,
  },
  name: {
    marginBottom: 4,
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 22,
  },
  email: {
    opacity: 0.7,
    color: COLORS.white,
    fontSize: 15,
  },
  settingsCard: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 18,
  },
  listTitle: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  listDescription: {
    color: COLORS.background,
    fontSize: 14,
    opacity: 0.8,
  },
  actionsCard: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 0,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 0,
  },
});

export default ProfileScreen; 