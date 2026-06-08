import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { colors } from '../design/tokens';

export default function AppLayout({ children, title }) {
  return (
    <View style={styles.container}>
      <TopBar title={title} />
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
