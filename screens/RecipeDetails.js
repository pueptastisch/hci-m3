import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';

const DUMMY_RECIPE = {
  id: '1',
  title: 'Spaghetti Carbonara',
  description: 'A classic Italian pasta dish made with egg, hard cheese, cured pork, and black pepper.',
  difficulty: '2/5',
  image: 'https://img.chefkoch-cdn.de/rezepte/1298241234947062/bilder/1616493/crop-640x427/carbonara-wie-bei-der-mamma-in-rom.jpg',
  ingredients: [
    '200g Spaghetti',
    '100g Pancetta',
    '2 large eggs',
    '50g Pecorino cheese',
    'Black pepper'
  ],
  steps: [
    'Boil the pasta in salted water.',
    'Fry the pancetta until crisp.',
    'Beat the eggs and mix with grated cheese.',
    'Combine hot pasta with pancetta, then remove from heat.',
    'Quickly stir in the egg and cheese mixture until creamy.',
    'Serve immediately with extra black pepper.'
  ]
};

export default function RecipeDetails() {
  const [activeTab, setActiveTab] = useState('Ingredients');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { savedRecipes, setSavedRecipes } = useContext(AppContext);
  
  const isSaved = savedRecipes.some(recipe => recipe.id === DUMMY_RECIPE.id);

  const toggleSave = () => {
    if (isSaved) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== DUMMY_RECIPE.id));
    } else {
      setSavedRecipes([...savedRecipes, DUMMY_RECIPE]);
    }
  };
  
  // Keep track of which ingredients are checked
  const [checkedIngredients, setCheckedIngredients] = useState(
    new Array(DUMMY_RECIPE.ingredients.length).fill(false)
  );

  const toggleIngredient = (index) => {
    const updated = [...checkedIngredients];
    updated[index] = !updated[index];
    setCheckedIngredients(updated);
  };

  const handleNextStep = () => {
    if (currentStepIndex < DUMMY_RECIPE.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Top Half: Image & Description */}
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: DUMMY_RECIPE.image }} style={styles.image} />
            <TouchableOpacity 
              style={styles.saveIcon} 
              onPress={toggleSave}
            >
              <Ionicons 
                name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={28} 
                color={isSaved ? colors.brand : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{DUMMY_RECIPE.title}</Text>
          <Text style={styles.description}>{DUMMY_RECIPE.description}</Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('Ingredients')}
          >
            <Text style={[styles.tabText, activeTab === 'Ingredients' && styles.activeTabText]}>
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Cooking Steps' && styles.activeTab]}
            onPress={() => setActiveTab('Cooking Steps')}
          >
            <Text style={[styles.tabText, activeTab === 'Cooking Steps' && styles.activeTabText]}>
              Cooking Steps
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Half: Content based on Active Tab */}
        <View style={styles.bottomSection}>
          {activeTab === 'Ingredients' ? (
            <View style={styles.ingredientsContainer}>
              <ScrollView>
                {DUMMY_RECIPE.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientRow}>
                    <Checkbox
                      value={checkedIngredients[index]}
                      onValueChange={() => toggleIngredient(index)}
                      color={checkedIngredients[index] ? colors.brand : undefined}
                    />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.exportButtonContainer}>
                <Button title="Export List" onPress={() => console.log('Export hit')} color={colors.brand} />
              </View>
            </View>
          ) : (
            <View style={styles.stepsContainer}>
              <Text style={styles.stepIndicator}>
                Step {currentStepIndex + 1} of {DUMMY_RECIPE.steps.length}
              </Text>
              <View style={styles.stepCard}>
                <Text style={styles.stepText}>
                  {DUMMY_RECIPE.steps[currentStepIndex]}
                </Text>
              </View>

              <View style={styles.stepNavigation}>
                <Button 
                  title="Previous" 
                  onPress={handlePrevStep} 
                  disabled={currentStepIndex === 0} 
                  color={colors.textMuted}
                />
                <Button 
                  title="Next" 
                  onPress={handleNextStep} 
                  disabled={currentStepIndex === DUMMY_RECIPE.steps.length - 1} 
                  color={colors.brand}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topSection: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: radii.sm,
    backgroundColor: colors.placeholder,
  },
  saveIcon: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: spacing.xs + 2,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.brand,
  },
  tabText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textDisabled,
  },
  activeTabText: {
    color: colors.brand,
  },
  bottomSection: {
    flex: 1,
    padding: spacing.lg,
  },
  ingredientsContainer: {
    flex: 1,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  ingredientText: {
    marginLeft: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  exportButtonContainer: {
    marginTop: spacing.lg,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stepIndicator: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm + 2,
  },
  stepCard: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: spacing.xxl,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepText: {
    fontSize: fontSizes.lg + 2,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
});
