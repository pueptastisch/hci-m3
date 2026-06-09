import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';

const GOALS = [
  { id: 'healthy', label: 'Healthy Eating', description: 'Focus on nutritious and balanced meals.' },
  { id: 'calories', label: 'Maintaining Calory Goal', description: 'Keep track of your energy intake.' },
  { id: 'recipes', label: 'Just Finding New Recipes', description: 'Explore diverse and exciting dishes.' },
];

export default function GoalSelection({ navigation, route }) {
  const { goal, setGoal } = useContext(AppContext);

  const handleContinue = () => {
    if (goal) {
      if (route.params?.fromSettings) {
        navigation.goBack();
      } else {
        navigation.navigate('DietaryPreferences');
      }
    }
  };

  return (
    <View style={styles.screen}>
      <TopBar />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What is your goal?</Text>
        <Text style={styles.subtitle}>Help us personalize your experience by telling us what you want to achieve.</Text>

        <View style={styles.optionsContainer}>
          {GOALS.map((item) => {
            const isSelected = goal === item.label;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setGoal(item.label)}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected
                  ]}>
                    {item.label}
                  </Text>
                  <View style={[
                    styles.radio,
                    isSelected && styles.radioSelected
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.button, !goal && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={!goal}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: colors.brand,
    borderWidth: 2,
    backgroundColor: '#F7FFF8',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  optionLabel: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.brand,
  },
  optionDescription: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    lineHeight: 20,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.brand,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand,
  },
  bottomSection: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    backgroundColor: '#CFF7D3',
    borderWidth: 1,
    borderColor: colors.brand,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
});
