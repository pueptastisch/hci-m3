import React, { useCallback, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Easing } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFocusEffect } from '@react-navigation/native';

import AppLayout from '../components/AppLayout';
import { getGroups } from '../data/groupsStore';
import { getDietaryPreferencesForUsernames } from '../data/users';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';

import { AppContext } from '../context/AppContext';
import { ALL_RECIPES } from '../data/recipesStore';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

const GeneratingAnimation = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      <Text style={styles.loadingText}>Recipy is creating your perfect dish...</Text>
    </View>
  );
};

export default function Explore({ navigation }) {
  const [activeTab, setActiveTab] = useState('Explore Recipes');
  const { myIngredients, dietaryPreferences, allergies, cookingEquipment } = useContext(AppContext);
  
  // Generate Form State
  const [ingredients, setIngredients] = useState('');
  const [includeMyIngredients, setIncludeMyIngredients] = useState(false);
  const [mealType, setMealType] = useState('');
  const [isMealTypeDropdownOpen, setIsMealTypeDropdownOpen] = useState(false);
  const [preferences, setPreferences] = useState('');
  const [includeMyPreferences, setIncludeMyPreferences] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('none');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  // Generation result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const loadGroups = useCallback(() => {
    const nextGroups = getGroups();
    setGroups(nextGroups);

    if (nextGroups.length === 0) {
      setSelectedGroupId('none');
      return;
    }

    if (selectedGroupId === 'none') {
      return;
    }

    const selectedStillExists = nextGroups.some((group) => group.id === selectedGroupId);
    if (!selectedStillExists) {
      setSelectedGroupId('none');
    }
  }, [selectedGroupId]);

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [loadGroups])
  );

  const handleClear = () => {
    setIngredients('');
    setIncludeMyIngredients(false);
    setMealType('');
    setPreferences('');
    setIncludeMyPreferences(false);
    setIsGroupDropdownOpen(false);
    setIsMealTypeDropdownOpen(false);
    setHasGenerated(false);
    setGeneratedRecipes([]);
  };

  const filterRecipes = (recipes, options = {}) => {
    const {
      manualIngredients = [],
      manualPreferences = [],
      useProfileIngredients = false,
      useProfilePreferences = false,
      checkCookware = true,
      checkAllergies = true,
      mealTypeFilter = '',
    } = options;

    const allSearchIngredients = [
      ...manualIngredients.map(i => i.toLowerCase()),
      ...(useProfileIngredients ? myIngredients.map(i => i.toLowerCase()) : [])
    ];
    const uniqueSearchIngredients = [...new Set(allSearchIngredients)];

    const allDietaryPrefs = [
      ...manualPreferences.map(p => p.toLowerCase()),
      ...(useProfilePreferences ? dietaryPreferences.filter(p => p !== 'None').map(p => p.toLowerCase()) : [])
    ];
    const uniqueDietaryPrefs = [...new Set(allDietaryPrefs)];

    const activeAllergies = allergies.filter(a => a !== 'None');

    return recipes.filter(recipe => {
      // 1. Meal Type Filter
      if (mealTypeFilter && recipe.mealType !== mealTypeFilter) return false;

      // 2. Cookware Filter (Must have all required cookware)
      if (checkCookware && recipe.requiredCookware.length > 0) {
        const hasAllCookware = recipe.requiredCookware.every(rc => 
          cookingEquipment.includes(rc)
        );
        if (!hasAllCookware) return false;
      }

      // 3. Allergies Filter (Must not contain any user allergens)
      if (checkAllergies && recipe.allergens.length > 0 && activeAllergies.length > 0) {
        const hasAllergenMatch = recipe.allergens.some(ra => 
          activeAllergies.includes(ra)
        );
        if (hasAllergenMatch) return false;
      }

      // 4. Dietary Preferences Filter (Must match ALL set preferences)
      if (uniqueDietaryPrefs.length > 0) {
        const recipeTags = recipe.dietaryTags.map(t => t.toLowerCase());
        const matchesAllPrefs = uniqueDietaryPrefs.every(pref => 
          recipeTags.includes(pref)
        );
        if (!matchesAllPrefs) return false;
      }

      // 5. Ingredients Matching (only for Generation)
      if (uniqueSearchIngredients.length > 0) {
        const matchingIngredients = uniqueSearchIngredients.filter(ui => 
          recipe.searchIngredients.some(ri => ri.toLowerCase().includes(ui) || ui.includes(ri.toLowerCase()))
        );
        if (matchingIngredients.length < 2) return false;
      }

      return true;
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);

    // Simulate network delay
    setTimeout(() => {
      const manualIngredients = ingredients.split(',').map(i => i.trim()).filter(Boolean);
      const manualPreferences = preferences.split(',').map(p => p.trim()).filter(Boolean);

      const matched = filterRecipes(ALL_RECIPES, {
        manualIngredients,
        manualPreferences,
        useProfileIngredients: includeMyIngredients,
        useProfilePreferences: includeMyPreferences,
        mealTypeFilter: mealType,
      });

      setGeneratedRecipes(matched);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2500);
  };

  // Explore tab: Only show recipes that fit user's profile (Allergies, Cookware, Global Prefs)
  const exploreRecipes = filterRecipes(ALL_RECIPES, {
    useProfilePreferences: true, // Always respect profile preferences on Explore
    manualIngredients: [], // No ingredient matching on main Explore
  });

  const isGenerateDisabled = !ingredients.trim() && !(includeMyIngredients && myIngredients.length > 0);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;
  const selectedGroupLabel = selectedGroup
    ? `${selectedGroup.name} (${selectedGroup.members.length})`
    : 'None';
  const selectedGroupDietaryPreferences = selectedGroup
    ? getDietaryPreferencesForUsernames(selectedGroup.members)
    : [];

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.difficulty}>Difficulty: {item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout title="Recipy">
      <View style={styles.container}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Explore Recipes' && styles.activeTab]}
            onPress={() => {
              setActiveTab('Explore Recipes');
              setHasGenerated(false);
            }}
          >
            <Text style={[styles.tabText, activeTab === 'Explore Recipes' && styles.activeTabText]}>
              Explore Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Generate' && styles.activeTab]}
            onPress={() => setActiveTab('Generate')}
          >
            <Text style={[styles.tabText, activeTab === 'Generate' && styles.activeTabText]}>
              Generate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        {activeTab === 'Explore Recipes' ? (
          <View style={styles.contentContainer}>
            {exploreRecipes.length > 0 ? (
              <FlatList
                data={exploreRecipes}
                keyExtractor={(item) => item.id}
                renderItem={renderRecipeItem}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyExploreContainer}>
                <Text style={styles.emptyExploreText}>
                  We couldn't find any recipes that match your current profile.
                </Text>
                <Text style={styles.emptyExploreSubtext}>
                  Try adjusting your dietary preferences or cookware in Settings to see more results!
                </Text>
                <TouchableOpacity 
                  style={styles.settingsButton} 
                  onPress={() => navigation.navigate('Settings')}
                >
                  <Text style={styles.settingsButtonText}>Update My Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {isGenerating ? (
              <GeneratingAnimation />
            ) : hasGenerated ? (
              <View style={styles.contentContainer}>
                <View style={styles.resultsHeader}>
                  <TouchableOpacity onPress={() => setHasGenerated(false)}>
                    <Text style={styles.backToFormText}>← Edit Preferences</Text>
                  </TouchableOpacity>
                </View>
                {generatedRecipes.length > 0 ? (
                  <FlatList
                    data={generatedRecipes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRecipeItem}
                    contentContainerStyle={styles.listContainer}
                  />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No exact matches found, but you can try adjusting your preferences!</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => setHasGenerated(false)}>
                      <Text style={styles.retryButtonText}>Adjust Settings</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <ScrollView style={styles.contentContainer} contentContainerStyle={styles.formContainer}>
                <Text style={styles.label}>What ingredients do you have?</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="e.g., Chicken, broccoli, rice..."
                  value={ingredients}
                  onChangeText={setIngredients}
                />

                <TouchableOpacity 
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                  onPress={() => setIncludeMyIngredients(!includeMyIngredients)}
                >
                  <Checkbox
                    value={includeMyIngredients}
                    onValueChange={setIncludeMyIngredients}
                    color={includeMyIngredients ? colors.brand : undefined}
                  />
                  <Text style={styles.checkboxLabel}>Include My Ingredients</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setIsMealTypeDropdownOpen(!isMealTypeDropdownOpen)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownTriggerText}>{mealType || 'Select Meal Type'}</Text>
                    <Text style={styles.dropdownChevron}>{isMealTypeDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isMealTypeDropdownOpen ? (
                    <View style={styles.dropdownMenu}>
                      {MEAL_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setMealType(type);
                            setIsMealTypeDropdownOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>

                <Text style={styles.label}>Dietary Preferences / Restrictions</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g., Vegetarian, low-carb..."
                  value={preferences}
                  onChangeText={setPreferences}
                  multiline
                  numberOfLines={3}
                />

                <TouchableOpacity 
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                  onPress={() => setIncludeMyPreferences(!includeMyPreferences)}
                >
                  <Checkbox
                    value={includeMyPreferences}
                    onValueChange={setIncludeMyPreferences}
                    color={includeMyPreferences ? colors.brand : undefined}
                  />
                  <Text style={styles.checkboxLabel}>Include My Preferences</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Group For Recipe Generation</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setIsGroupDropdownOpen((previous) => !previous)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownTriggerText}>{selectedGroupLabel}</Text>
                    <Text style={styles.dropdownChevron}>{isGroupDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isGroupDropdownOpen ? (
                    <View style={styles.dropdownMenu}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedGroupId('none');
                          setIsGroupDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>None</Text>
                      </TouchableOpacity>

                      {groups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedGroupId(group.id);
                            setIsGroupDropdownOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {group.name} ({group.members.length})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleClear}>
                    <Text style={styles.buttonSecondaryText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.buttonPrimary, isGenerateDisabled && styles.buttonDisabled]} 
                    onPress={handleGenerate}
                    disabled={isGenerateDisabled}
                  >
                    <Text style={styles.buttonPrimaryText}>Generate Recipe</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.brand,
  },
  tabText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.brand,
    fontWeight: fontWeights.semibold,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    marginVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: 'Jaini-Regular',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.xl,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  dropdownContainer: {
    marginTop: spacing.xs,
  },
  dropdownTrigger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  dropdownTriggerText: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dropdownChevron: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  dropdownMenu: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.md,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  checkboxLabel: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxxl,
  },
  button: {
    flex: 0.48,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.brand,
  },
  buttonPrimaryText: {
    color: colors.surface,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  buttonDisabled: {
    backgroundColor: colors.brandLight,
    opacity: 0.7,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  buttonSecondaryText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: radii.md,
    backgroundColor: colors.borderMuted,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  difficulty: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.brand,
    backgroundColor: colors.brandLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: colors.brand,
    borderTopColor: 'transparent',
    borderRadius: 25,
    marginBottom: spacing.xl,
  },
  loadingText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: fontWeights.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
  },
  backToFormText: {
    color: colors.brand,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  retryButtonText: {
    color: colors.surface,
    fontWeight: fontWeights.bold,
  },
  emptyExploreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    marginTop: spacing.xxxl,
  },
  emptyExploreText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyExploreSubtext: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  settingsButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    ...shadows.md,
  },
  settingsButtonText: {
    color: colors.surface,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
});
