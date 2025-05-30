import React from 'react';
import { View, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const flagIcon = { uri: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' };

// Type definitions
interface Transaction {
  amount: number;
  time: string;
}

interface Place {
  lat: number;
  lng: number;
  title: string;
  transactions: Transaction[];
}

const places: Place[] = [
  {
    lat: 22.3072,
    lng: 73.1812,
    title: 'Vadodara Railway Station',
    transactions: [
      { amount: 1200, time: '10:30 AM' },
      { amount: 500, time: '2:15 PM' },
    ],
  },
  {
    lat: 22.2994,
    lng: 73.2081,
    title: 'Laxmi Vilas Palace',
    transactions: [
      { amount: 350, time: '9:00 AM' },
    ],
  },
  {
    lat: 22.3151,
    lng: 73.1742,
    title: 'Sayaji Baug',
    transactions: [
      { amount: 500, time: '4:45 PM' },
    ],
  },
  {
    lat: 22.3045,
    lng: 73.1912,
    title: 'Centre Square Mall',
    transactions: [
      { amount: 800, time: '1:20 PM' },
    ],
  },
  {
    lat: 22.3223,
    lng: 73.1661,
    title: 'Inorbit Mall',
    transactions: [
      { amount: 2000, time: '11:00 AM' },
    ],
  },
];

function showTransactionsAlert(place: Place): void {
  if (!place.transactions.length) return;
  
  const message = place.transactions
    .map((txn: Transaction) => `• Rs. ${txn.amount} at ${txn.time}`)
    .join('\n');

  Alert.alert(
    place.title,
    message,
    [
      {
        text: 'View Details',
        onPress: () => {
          // Show detailed transaction information
          const details = place.transactions
            .map((txn: Transaction) => 
              `Transaction Details:\n` +
              `Amount: Rs. ${txn.amount}\n` +
              `Time: ${txn.time}\n` +
              `Location: ${place.title}\n` +
              `Status: Completed\n` +
              `Type: ${txn.amount > 0 ? 'Income' : 'Expense'}`
            )
            .join('\n\n');
          
          Alert.alert(
            'Transaction Details',
            details,
            [{ text: 'Close' }],
            { cancelable: true }
          );
        }
      },
      { text: 'Close' }
    ],
    { cancelable: true }
  );
}

const AddTransactionScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 22.3072,
          longitude: 73.1812,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType="standard"
      >
        {places.map((place: Place, idx: number) => (
          <Marker
            key={place.title + idx}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            title={place.title}
            onPress={() => showTransactionsAlert(place)}
          >
            <Image source={flagIcon} style={styles.flagIcon} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  flagIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    left: 10, // mimic the .flag-icon CSS
  },
});

export default AddTransactionScreen; 