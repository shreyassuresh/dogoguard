import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider, Portal, Dialog, Switch, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;
type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Login: undefined;
};

const COLORS = {
  background: '#0B0544',
  card: '#6EC1E4',
  accent: '#BFE8F9',
  white: '#fff',
  text: '#000',
  income: '#4CAF50',
  expense: '#FF5252',
  cardBackground: 'rgba(110, 193, 228, 0.1)',
};

// Sample bank data (same as in HomeScreen)
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

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { selectedBank } = useSelector((state: RootState) => state.user);
  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showQR, setShowQR] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    transactions: true,
    budgets: true,
    security: true,
    marketing: false,
  });

  const bankInfo = selectedBank ? (bankData as any)[selectedBank.name] : null;

  const handleSendMoney = () => {
    navigation.navigate('SendMoney');
  };

  const handleLogout = () => {
    // Add logout logic here
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Error taking photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Image 
                size={100} 
                source={require('../../../assets/icon.png')} 
                style={styles.avatar}
              />
            )}
            <View style={styles.cameraButtons}>
              <IconButton
                icon="camera"
                size={20}
                mode="contained"
                containerColor={COLORS.accent}
                iconColor={COLORS.text}
                onPress={takePhoto}
                style={styles.cameraButton}
              />
              <IconButton
                icon="image"
                size={20}
                mode="contained"
                containerColor={COLORS.accent}
                iconColor={COLORS.text}
                onPress={pickImage}
                style={styles.cameraButton}
              />
            </View>
          </View>
          <Text style={styles.name}>Shreyas Suresh</Text>
          <Text style={styles.email}>shreyas@example.com</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Card style={styles.actionCard} onPress={handleSendMoney}>
            <Card.Content style={styles.actionContent}>
              <MaterialCommunityIcons name="send" size={32} color={COLORS.accent} />
              <Text style={styles.actionText}>Send Money</Text>
            </Card.Content>
          </Card>
          <Card style={styles.actionCard} onPress={() => setShowQR(true)}>
            <Card.Content style={styles.actionContent}>
              <MaterialCommunityIcons name="qrcode-scan" size={32} color={COLORS.accent} />
              <Text style={styles.actionText}>Receive Money</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Bank Details */}
        <Card style={styles.sectionCard} onPress={() => setShowBankDetails(true)}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="bank" size={24} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Bank Details</Text>
            </View>
            <List.Item
              title={selectedBank?.name || 'Select a Bank'}
              description={`Account Number: ${bankInfo?.accountNumber || 'Not Available'}`}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              left={props => <List.Icon {...props} icon="bank" color={COLORS.accent} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.white} />}
            />
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="cog" size={24} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Account Settings</Text>
            </View>
            <List.Item
              title="Personal Information"
              titleStyle={styles.listItemTitle}
              left={props => <List.Icon {...props} icon="account" color={COLORS.accent} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.white} />}
              onPress={() => setShowPersonalInfo(true)}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Security Settings"
              titleStyle={styles.listItemTitle}
              left={props => <List.Icon {...props} icon="shield-lock" color={COLORS.accent} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.white} />}
              onPress={() => setShowSecurity(true)}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Notification Preferences"
              titleStyle={styles.listItemTitle}
              left={props => <List.Icon {...props} icon="bell" color={COLORS.accent} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.white} />}
              onPress={() => setShowNotifications(true)}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={COLORS.accent}
          icon="logout"
        >
          Logout
        </Button>
      </ScrollView>

      {/* Bank Details Dialog */}
      <Portal>
        <Dialog visible={showBankDetails} onDismiss={() => setShowBankDetails(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Bank Details</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <List.Item
                title="Bank Name"
                description={selectedBank?.name || 'Not Selected'}
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Account Number"
                description={bankInfo?.accountNumber || 'Not Available'}
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Balance"
                description={`Rs. ${bankInfo?.balance?.toFixed(2) || '0.00'}`}
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Recent Transactions"
                description={`${bankInfo?.transactions?.length || 0} transactions`}
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBankDetails(false)} textColor={COLORS.accent}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* QR Code Dialog */}
      <Portal>
        <Dialog visible={showQR} onDismiss={() => setShowQR(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Scan to Pay</Dialog.Title>
          <Dialog.Content>
            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <MaterialCommunityIcons name="qrcode" size={200} color={COLORS.background} />
              </View>
              <Text style={styles.qrText}>Scan this QR code to send money</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowQR(false)} textColor={COLORS.accent}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Personal Information Dialog */}
      <Portal>
        <Dialog visible={showPersonalInfo} onDismiss={() => setShowPersonalInfo(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Personal Information</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <List.Item
                title="Full Name"
                description="Shreyas Suresh"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Email"
                description="shreyas@example.com"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Phone"
                description="+91 98765 43210"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Location"
                description="Mumbai, India"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPersonalInfo(false)} textColor={COLORS.accent}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Security Settings Dialog */}
      <Portal>
        <Dialog visible={showSecurity} onDismiss={() => setShowSecurity(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Security Settings</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <List.Item
                title="Two-Factor Authentication"
                description="Add an extra layer of security"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => <Switch value={true} color={COLORS.accent} />}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Biometric Login"
                description="Use fingerprint or face ID"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => <Switch value={true} color={COLORS.accent} />}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Change Password"
                description="Update your password"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.white} />}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSecurity(false)} textColor={COLORS.accent}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Notification Preferences Dialog */}
      <Portal>
        <Dialog visible={showNotifications} onDismiss={() => setShowNotifications(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Notification Preferences</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <List.Item
                title="Transaction Alerts"
                description="Get notified about your transactions"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => (
                  <Switch
                    value={notifications.transactions}
                    onValueChange={value => setNotifications({ ...notifications, transactions: value })}
                    color={COLORS.accent}
                  />
                )}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Budget Alerts"
                description="Get notified about budget updates"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => (
                  <Switch
                    value={notifications.budgets}
                    onValueChange={value => setNotifications({ ...notifications, budgets: value })}
                    color={COLORS.accent}
                  />
                )}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Security Alerts"
                description="Get notified about security updates"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => (
                  <Switch
                    value={notifications.security}
                    onValueChange={value => setNotifications({ ...notifications, security: value })}
                    color={COLORS.accent}
                  />
                )}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Marketing Updates"
                description="Receive promotional notifications"
                titleStyle={styles.dialogItemTitle}
                descriptionStyle={styles.dialogItemDescription}
                right={() => (
                  <Switch
                    value={notifications.marketing}
                    onValueChange={value => setNotifications({ ...notifications, marketing: value })}
                    color={COLORS.accent}
                  />
                )}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNotifications(false)} textColor={COLORS.accent}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: COLORS.accent,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButtons: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    flexDirection: 'row',
  },
  cameraButton: {
    marginHorizontal: 2,
  },
  name: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: COLORS.cardBackground,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    color: COLORS.white,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
    borderColor: COLORS.accent,
  },
  dialog: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
  },
  dialogTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialogContent: {
    paddingVertical: 8,
  },
  dialogItemTitle: {
    color: COLORS.white,
    fontSize: 16,
  },
  dialogItemDescription: {
    color: COLORS.white,
    opacity: 0.7,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    color: COLORS.white,
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  listItemTitle: {
    color: COLORS.white,
  },
  listItemDescription: {
    color: COLORS.white,
    opacity: 0.7,
    fontSize: 14,
  },
});

export default ProfileScreen; 