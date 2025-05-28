import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TabHeaderProps {
  title: string;
  subtitle?: string;
}

const TabHeader: React.FC<TabHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#e6d1f2', // light purple
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 3,
    borderBottomColor: '#5a8dee', // blue
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#222',
    marginLeft: 4,
    marginTop: -2,
  },
});

export default TabHeader; 