import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import TopBar from './TopBar';
import BottomNav from './BottomNav';

const { height } = Dimensions.get('window');

export default function AppLayout({ children }) {
  return (
    <View style={styles.container}>

      <TopBar />

      <View style={styles.content}>
        {children}
      </View>

      <BottomNav />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },

  content: {
    flex: 1,
  },
});