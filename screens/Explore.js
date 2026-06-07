import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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

// Mock data to get you started
const dummyRecipes = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish made with egg, hard cheese, cured pork, and black pepper.',
    difficulty: '2/5',
    image: 'https://img.chefkoch-cdn.de/rezepte/1298241234947062/bilder/1616493/crop-640x427/carbonara-wie-bei-der-mamma-in-rom.jpg',
  }
];

export default function Explore({ navigation }) {
  const [activeTab, setActiveTab] = useState('Explore Recipes');
  
  // Generate Form State
  const [ingredients, setIngredients] = useState('');
  const [includeMyIngredients, setIncludeMyIngredients] = useState(false);
  const [mealType, setMealType] = useState('');
  const [preferences, setPreferences] = useState('');
  const [includeMyPreferences, setIncludeMyPreferences] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('none');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

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

    // Keep selection valid after returning from Group Management.
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
    // Reset UI state as well as form values.
    setIsGroupDropdownOpen(false);
  };

  const handleGenerate = () => {
    const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;
    const groupDietaryPreferences = selectedGroup
      ? getDietaryPreferencesForUsernames(selectedGroup.members)
      : [];

    const manualPreferences = preferences
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    // Merge manual preferences with group-derived preferences, deduping case-insensitively.
    const mergedPreferences = [...manualPreferences];
    groupDietaryPreferences.forEach((groupPreference) => {
      const alreadyIncluded = mergedPreferences.some(
        (item) => item.toLowerCase() === groupPreference.toLowerCase()
      );
      if (!alreadyIncluded) {
        mergedPreferences.push(groupPreference);
      }
    });

    const finalPreferences = mergedPreferences.join(', ');
    if (finalPreferences !== preferences) {
      // Show users the final preferences that will be used for generation.
      setPreferences(finalPreferences);
    }

    // Generate logic here
    console.log('Generating with:', {
      ingredients,
      includeMyIngredients,
      mealType,
      preferences: finalPreferences,
      includeMyPreferences,
      groupId: selectedGroup ? selectedGroup.id : null,
      groupName: selectedGroup ? selectedGroup.name : null,
      groupMembers: selectedGroup ? selectedGroup.members : [],
      groupDietaryPreferences,
    });
  };

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
    <AppLayout>
      <View style={styles.container}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Explore Recipes' && styles.activeTab]}
            onPress={() => setActiveTab('Explore Recipes')}
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
            <Text style={styles.header}>Explore Recipes</Text>
            <FlatList
              data={dummyRecipes}
              keyExtractor={(item) => item.id}
              renderItem={renderRecipeItem}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <ScrollView style={styles.contentContainer} contentContainerStyle={styles.formContainer}>
            <Text style={styles.header}>Generate a Recipe</Text>
            
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
            <TextInput 
              style={styles.input}
              placeholder="e.g., Breakfast, Lunch, Dinner..."
              value={mealType}
              onChangeText={setMealType}
            />

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
              {/* Custom dropdown keeps this control visually aligned with token-styled inputs. */}
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
            {groups.length === 0 ? (
              <Text style={styles.helperText}>
                No groups yet. Create one in Settings {'>'} Group Management.
              </Text>
            ) : null}
            {selectedGroup && selectedGroupDietaryPreferences.length > 0 ? (
              <Text style={styles.helperText}>
                Group dietary preferences that will be added: {selectedGroupDietaryPreferences.join(', ')}
              </Text>
            ) : null}

            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleClear}>
                <Text style={styles.buttonSecondaryText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleGenerate}>
                <Text style={styles.buttonPrimaryText}>Generate Recipe</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
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
  helperText: {
    marginTop: spacing.xs,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
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
});
