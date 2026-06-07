import React, { useContext } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';

export default function DietaryPrefrences({ navigation, route }) {
  
  const { dietaryPreferences: selected, setDietaryPreferences: setSelected } = useContext(AppContext);
  const insets = useSafeAreaInsets();

  const options = [
    'Dairy Free',
    'Diabetic Friendly',
    'Gluten Free',
    'Halal',
    'Hindu Vegetarian',
    'Keto',
    'Kosher',
    'Pescatarian',
    'Vegan',
    'Vegetarian',
  ];

  return (
    
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent />
      
      <View style={[styles.container, { paddingTop: insets.top || spacing.lg }]}>
        <View style={styles.innerContainer}>
          <Text style={styles.logo}>
            Dietary Preferences
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          Choose Your Dietary Prefrences
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>

        {options.map(item => (
          <TouchableOpacity 
            key={item} 
            style={styles.options}
            activeOpacity={0.7}
            onPress={() => {
              if (selected.includes(item)) {
                setSelected(selected.filter(i => i !== item));
              } else {
                setSelected([...selected, item]);
              }
            }}
          >

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

          </TouchableOpacity>
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    ...shadows.sm,
    zIndex: 10,
  },

  innerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
    fontSize: fontSizes.xl,
    textAlign: 'center',
    fontWeight: fontWeights.semibold,
  },

  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.lg - 1,
    marginBottom: spacing.lg,
  },
  optionstext: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    marginLeft: spacing.sm + 2,
  },

  bottomSection: {
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },

  leftButton: {
    width: 140,
    height: 50,
    borderWidth: 1,
    backgroundColor: '#CFF7D3',
    borderColor: colors.brand,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightButton: {
    width: 170,
    height: 50,
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },

  rightButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
});
