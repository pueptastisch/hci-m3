import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';

export default function Settings({ navigation }) {
  const { resetApp } = useContext(AppContext);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out? This will erase all your preferences and ingredients.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            resetApp();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        }
      ]
    );
  };

  return (
    <AppLayout title="Settings">
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('GoalSelection', { fromSettings: true })}
          >
            <Text style={styles.itemText}>My Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('DietaryPreferences', { fromSettings: true })}
          >
            <Text style={styles.itemText}>Dietary Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('Allergies', { fromSettings: true })}
          >
            <Text style={styles.itemText}>Allergies</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('CookingEquipment', { fromSettings: true })}
          >
            <Text style={styles.itemText}>Cooking Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('GroupManagement')}
          >
            <Text style={styles.itemText}>Group Management</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.itemText}>Subscription</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('PaymentInfo')}
          >
            <Text style={styles.itemText}>Payment Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Text style={[styles.itemText, { color: colors.danger }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportText}>
            Have issues or questions? Contact us at{' '}
            <Text style={styles.supportEmail}>support@reci.py</Text>
          </Text>
        </View>
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
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  itemText: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  supportSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  supportText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  supportEmail: {
    color: colors.brand,
    fontWeight: fontWeights.bold,
  },
});