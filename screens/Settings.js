import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
} from '../design/tokens';


//settings page to navigate to the different subpages (dietary preferences, allergies, cooking equipment, 
// group management, payment info, subscription, log out)

export default function Settings({navigation}) {
  return (
    <AppLayout>
      <ScrollView style={styles.container}>

        <Text style={styles.sectionTitle}>
          Preferences
        </Text>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DietaryPreferences' , { fromSettings: true })}>
          <Text style={styles.itemText}>
            Dietary Preferences
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Allergies', { fromSettings: true })}>
          <Text style={styles.itemText}>
            Allergies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('CookingEquipment')}>
          <Text style={styles.itemText}>
            Cooking Equipment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('GroupManagement')}>
          <Text style={styles.itemText}>
            Group Management
          </Text>
        </TouchableOpacity>



        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Payment Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Log Out
          </Text>
        </TouchableOpacity>
        

      </ScrollView>
      
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },

  sectionTitle: {
    fontSize: fontSizes.display,
    fontWeight: 'bold',
    marginTop: spacing.xl,
    marginBottom: spacing.lg - 1,
    color: colors.textPrimary,
  },

  item: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: radii.md,
    marginBottom: spacing.lg - 1,

    borderWidth: 1,
    borderColor: colors.border,
  },

  itemText: {
    fontSize: fontSizes.xxl,
    color: colors.textPrimary,
  },
});
