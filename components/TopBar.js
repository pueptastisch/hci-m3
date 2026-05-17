import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { colors, fontSizes } from '../design/tokens';

const { height } = Dimensions.get('window');

export default function TopBar() {
  return (
    
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Text style={styles.logo}>
        Recipy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * (2 / 12),
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    fontSize: fontSizes.brand,
    color: colors.brand,
    fontFamily: 'Jaini-Regular'
  },
});