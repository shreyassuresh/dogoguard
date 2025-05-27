import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSelectedBank } from '../../store/slices/userSlice';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const banks = [
  {
    name: 'State Bank of India',
    logo: require('../../../assets/State bank of india.png'),
  },
  {
    name: 'Punjab National Bank',
    logo: require('../../../assets/Punjab national bank.png'),
  },
  {
    name: 'Bank of Baroda',
    logo: require('../../../assets/Bank of baroda.png'),
  },
  {
    name: 'Central Bank of India',
    logo: require('../../../assets/Central bank of india.png'),
  },
];

const BankSelectionScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const handleSelectBank = (bank: { name: string; logo: any }) => {
    dispatch(setSelectedBank({ name: bank.name, logo: bank.logo }));
    Alert.alert(
      'Bank Selected',
      `${bank.name} selected`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.root}>
      {/* Top section: Left oval and bank image side by side */}
      <View style={styles.topRow}>
        <View style={styles.leftOvalContainer}>
          <View style={styles.leftOval}>
            <Text style={styles.verticalText}>{'B\nA\nN\nK'}</Text>
          </View>
        </View>
        <Image source={require('../../../assets/Bank.jpg')} style={styles.bankImage} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bank list */}
        {banks.map((bank, idx) => (
          <TouchableOpacity key={bank.name} style={styles.bankOval} onPress={() => handleSelectBank(bank)}>
            <Text style={styles.bankName}>{bank.name}</Text>
            <Image source={bank.logo} style={styles.bankLogo} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const OVAL_HEIGHT = 200;
const OVAL_WIDTH = 60;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 60,
    marginBottom: 10,
    paddingLeft: 10,
  },
  leftOvalContainer: {
    width: OVAL_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftOval: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    backgroundColor: '#6c6c6c',
    borderTopRightRadius: OVAL_HEIGHT / 2,
    borderBottomRightRadius: OVAL_HEIGHT / 2,
    borderTopLeftRadius: OVAL_WIDTH / 2,
    borderBottomLeftRadius: OVAL_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 28,
  },
  bankImage: {
    width: 200,
    height: 140,
    marginLeft: 65,
    marginTop: 10,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 10,
    paddingLeft: 0,
    width: '100%',
  },
  bankOval: {
    width: '90%',
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bankName: {
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
  },
  bankLogo: {
    width: 63,
    height: 35,
    marginLeft: 18,
  },
});

export default BankSelectionScreen; 