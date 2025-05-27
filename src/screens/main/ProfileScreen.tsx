import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Switch, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import type { RootState } from '../../store';
import { updateUserPreferences, clearUser } from '../../store/slices/userSlice';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

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
                right={() => (
                  <Switch
                    value={currentUser.preferences.notifications}
                    onValueChange={handleToggleNotifications}
                  />
                )}
              />
              <List.Item
                title="Dark Theme"
                right={() => (
                  <Switch
                    value={currentUser.preferences.theme === 'dark'}
                    onValueChange={handleToggleTheme}
                  />
                )}
              />
              <List.Item
                title="Currency"
                description={currentUser.preferences.currency}
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
            >
              Export Data
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                // TODO: Show delete account dialog
              }}
              style={styles.actionButton}
            >
              Delete Account
            </Button>

            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 24,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
  },
  settingsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionsCard: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen; 