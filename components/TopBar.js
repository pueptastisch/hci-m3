import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function TopBar() {
  return (
    
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEDED" />
      <Text style={styles.logo}>
        Recipy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * (2 / 12),
    backgroundColor: '#EDEDED',
    borderBottomWidth: 1,
    borderBottomColor: '#c0bfbf',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    fontSize: 40,
    color: '#34C759',
    fontFamily: 'Jaini-Regular'
  },
});