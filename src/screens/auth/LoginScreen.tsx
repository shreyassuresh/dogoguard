import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Text as RNText, Dimensions, SafeAreaView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import type { RootState } from '../../store';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedBank = useSelector((state: RootState) => state.user.selectedBank);

  const handleLogin = async () => {
    setLoading(true);
    try {
      dispatch(
        setUser({
          id: '1',
          email,
          name: 'Test User',
          preferences: {
            currency: 'USD',
            theme: 'light',
            notifications: true,
          },
        })
      );
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Top Section: Logo and Title */}
        <View style={styles.topSection}>
          <Image source={require('../../../assets/Dogonew.png')} style={styles.logo} />
          <Text style={styles.logoText}>DOGO GUARD</Text>
          <Text style={styles.slogan}>YOUR MONEY'S BEST FRIEND</Text>
        </View>
        {selectedBank && (
          <View style={styles.selectedBankContainer}>
            <Text style={styles.selectedBankText}>{selectedBank.name}</Text>
            <Image source={selectedBank.logo} style={styles.selectedBankLogo} resizeMode="contain" />
          </View>
        )}
        {/* Oval Form Container */}
        <View style={styles.ovalContainer}>
          <Text style={styles.loginTitle}>Login</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              label="Username"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              style={styles.input}
              left={<TextInput.Icon icon={() => <Icon name="account" size={22} color="#757575" />} />}
              underlineColor="#757575"
              theme={{ colors: { text: '#333', primary: '#757575' } }}
              selectionColor="#6c1e8f"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="flat"
              style={styles.input}
              secureTextEntry
              left={<TextInput.Icon icon={() => <Icon name="lock" size={22} color="#757575" />} />}
              underlineColor="#757575"
              theme={{ colors: { text: '#333', primary: '#757575' } }}
              selectionColor="#6c1e8f"
            />
          </View>
          <View style={styles.loginButtonContainer}>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
              loading={loading}
              disabled={loading}
              buttonColor="#6c1e8f"
            >
              Login
            </Button>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.orText}>Or sign up with</Text>
          <TouchableOpacity 
            style={styles.bankButton}
            onPress={() => navigation.navigate('BankSelectionScreen')}
          >
            <RNText style={styles.bankButtonText}>Bank</RNText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const OVAL_HEIGHT = 340;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12003b',
  },
  container: {
    flex: 1,
    backgroundColor: '#12003b',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    zIndex: 2,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  slogan: {
    fontSize: 11,
    color: '#fff',
    marginTop: 2,
    marginBottom: 10,
    letterSpacing: 1,
  },
  ovalContainer: {
    width: width * 1.1,
    height: OVAL_HEIGHT,
    backgroundColor: '#eaeaea',
    borderRadius: width,
    alignItems: 'center',
    paddingTop: 50,
    marginTop: -10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#181c2f',
    alignSelf: 'center',
  },
  inputWrapper: {
    width: '80%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 12,
    fontSize: 16,
  },
  loginButtonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loginButton: {
    width: 120,
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#6c1e8f',
  },
  forgotPasswordContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  forgotPasswordText: {
    color: '#a020f0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 30,
    flex: 1,
    width: '100%',
    backgroundColor: '#12003b',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  orText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 25,
  },
  bankButton: {
    backgroundColor: '#7c6cf7',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  bankButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  selectedBankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  selectedBankText: {
    fontSize: 16,
    color: '#6c1e8f',
    fontWeight: 'bold',
    marginRight: 10,
  },
  selectedBankLogo: {
    width: 40,
    height: 25,
  },
});

export default LoginScreen;