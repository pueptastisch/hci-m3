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


// simple page with checkboxes for the user to select their dietary preferences

export default function DietaryPrefrences({ navigation, route }) {
  
  const [selected, setSelected] = useState([]);

  const options = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Halal',
    'Kosher',
    'Gluten Free',
    'Dairy Free',
    'Pescatarian',
    'Hindu Vegetarian',
    'Diabetic Friendly',
  ];

  return (
    
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Text style={styles.logo}>
          Dietary Preferences
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          Choose Your Dietary Prefrences
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

        <TouchableOpacity style={styles.leftButton} onPress={() => {
                                                              if (route.params?.fromSettings) {
                                                                  navigation.goBack();
                                                              } else {
                                                                navigation.navigate('Allergies');
                                                              }}}>
          <Text style={styles.leftButtonText}>
            setup later
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightButton} onPress={() => {
                                                              if (route.params?.fromSettings) {
                                                                  navigation.goBack();
                                                              } else {
                                                                navigation.navigate('Allergies');
                                                              }}}>
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
