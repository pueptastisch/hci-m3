import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native';
import Checkbox from 'expo-checkbox';

import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
} from '../design/tokens';

const { height } = Dimensions.get('window');

export default function CookingEquipment({ navigation }) {

  const [selected, setSelected] = useState([]);

  const options = [
    'Stove',
    'Oven',
    'Microwave',
    'Airfryer',
    'Cooking Pots',
  ];

  return (
    <View style={styles.screen}>

      <View style={styles.container}>
        <Text style={styles.logo}>
          Cooking Equipment
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          Choose your Cookware
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>

        {options.map(item => (
          <View key={item} style={styles.options}>

            <Checkbox
              value={selected.includes(item)}
              onValueChange={() => {
                if (selected.includes(item)) {
                  setSelected(selected.filter(i => i !== item));
                } else {
                  setSelected([...selected, item]);
                }
              }}
            />

            <Text style={styles.optionstext}>
              {item}
            </Text>

          </View>
        ))}

      </ScrollView>

      <View style={styles.bottomSection}>

        <TouchableOpacity style={styles.leftButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.leftButtonText}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.rightButtonText}>
            choose selected
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

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
    fontFamily: 'Jaini',
  },
  content: {
    
  },

  description: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  descriptionText: {
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl + 10,
    fontSize: fontSizes.xxxl,
    textAlign: 'center',
  },

  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.lg - 1,
    marginBottom: spacing.xl,
    },
  optionstext: {
    color: colors.textPrimary,
    fontSize: fontSizes.xxxl,
    marginLeft: spacing.sm + 2,
  },

  bottomSection: {
    height: height * (2 / 12),

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  leftButton: {
    width: 190,
    height: 70,

    borderWidth: 1,

    backgroundColor: '#CFF7D3',

    borderColor: colors.brand,
    
    borderRadius: radii.md,
    marginBottom: spacing.xxxl + 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightButton: {
    width: 190,
    height: 70,

    backgroundColor: colors.brand,

    borderRadius: radii.md,
    marginBottom: spacing.xxxl + 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },

  rightButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
});
