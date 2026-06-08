import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';

export default function Subscription({ navigation }) {
  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.planCard}>
          <Text style={styles.currentPlanLabel}>Your Current Plan</Text>
          <Text style={styles.planName}>Recipy Pro</Text>
          <Text style={styles.planPrice}>$9.99 / month</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Pro Benefits</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• Unlimited AI recipe generations</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• Priority support</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• Early access to new features</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>• No advertisements</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Manage Billing</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.brand,
    alignItems: 'center',
    ...shadows.md,
    marginBottom: spacing.xxxl,
  },
  currentPlanLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  planName: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.brand,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
  },
  badgeText: {
    color: colors.surface,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.sm,
  },
  benefitsSection: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  benefitItem: {
    marginBottom: spacing.md,
  },
  benefitText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.md,
  },
});