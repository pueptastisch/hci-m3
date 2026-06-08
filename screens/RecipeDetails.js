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
import { getRecipeById } from '../data/recipesStore';

export default function RecipeDetails({ route }) {
  const { recipeId } = route.params;
  const recipe = getRecipeById(recipeId);

  const [activeTab, setActiveTab] = useState('Ingredients');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { savedRecipes, setSavedRecipes } = useContext(AppContext);
  
  if (!recipe) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <Text style={styles.title}>Recipe not found</Text>
        </View>
      </AppLayout>
    );
  }

  const isSaved = savedRecipes.some(r => r.id === recipe.id);

  const toggleSave = () => {
    if (isSaved) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };
  
  // Keep track of which ingredients are checked
  const [checkedIngredients, setCheckedIngredients] = useState(
    new Array(recipe.ingredients.length).fill(false)
  );

  const toggleIngredient = (index) => {
    const updated = [...checkedIngredients];
    updated[index] = !updated[index];
    setCheckedIngredients(updated);
  };

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleExport = () => {
    // In a real app, we would actually copy to clipboard here
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
    console.log('Export hit');
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Top Half: Image & Description */}
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
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
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
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
                {recipe.ingredients.map((ingredient, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.ingredientRow}
                    activeOpacity={0.7}
                    onPress={() => toggleIngredient(index)}
                  >
                    <Checkbox
                      value={checkedIngredients[index]}
                      onValueChange={() => toggleIngredient(index)}
                      color={checkedIngredients[index] ? colors.brand : undefined}
                    />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.exportHint}>
                  Mark the ingredients you don't have to export them as a shopping list.
                </Text>
              </ScrollView>
              <View style={styles.exportButtonContainer}>
                {showCopiedMessage && (
                  <View style={styles.copiedBadge}>
                    <Text style={styles.copiedBadgeText}>Copied to clipboard!</Text>
                  </View>
                )}
                <Button title="Export List" onPress={handleExport} color={colors.brand} />
              </View>
            </View>
          ) : (
            <View style={styles.stepsContainer}>
              <Text style={styles.stepIndicator}>
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </Text>
              <View style={styles.stepCard}>
                <Text style={styles.stepText}>
                  {recipe.steps[currentStepIndex]}
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
                  disabled={currentStepIndex === recipe.steps.length - 1} 
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
    alignItems: 'center',
  },
  image: {
    width: '85%',
    height: 140,
    borderRadius: radii.md,
    backgroundColor: colors.placeholder,
  },
  saveIcon: {
    position: 'absolute',
    bottom: spacing.sm,
    right: '7.5%',
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
  exportHint: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  copiedBadge: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    zIndex: 100,
  },
  copiedBadgeText: {
    color: colors.surface,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
});
