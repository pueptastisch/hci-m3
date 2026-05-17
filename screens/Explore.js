import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
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

            <View style={styles.checkboxRow}>
              <Checkbox
                value={includeMyIngredients}
                onValueChange={setIncludeMyIngredients}
                color={includeMyIngredients ? colors.brand : undefined}
              />
              <Text style={styles.checkboxLabel}>Include My Ingredients</Text>
            </View>

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

            <View style={styles.checkboxRow}>
              <Checkbox
                value={includeMyPreferences}
                onValueChange={setIncludeMyPreferences}
                color={includeMyPreferences ? colors.brand : undefined}
              />
              <Text style={styles.checkboxLabel}>Include My Preferences</Text>
            </View>

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
              <View style={styles.buttonWrapper}>
                <Button title="Clear" onPress={handleClear} color={colors.textDisabled} />
              </View>
              <View style={styles.buttonWrapper}>
                <Button title="Generate Recipe" onPress={handleGenerate} color={colors.brand} />
              </View>
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
    backgroundColor: colors.backgroundWarm,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
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
  contentContainer: {
    flex: 1,
  },
  header: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    margin: spacing.lg,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  label: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.sm,
    padding: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  dropdownContainer: {
    marginTop: 4,
  },
  dropdownTrigger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTriggerText: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  dropdownChevron: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  dropdownMenu: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownItemText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  helperText: {
    marginTop: 6,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: 6,
  },
  checkboxLabel: {
    marginLeft: spacing.sm + 2,
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
  },
  buttonWrapper: {
    flex: 0.48,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    elevation: 2, 
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    backgroundColor: colors.placeholder,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.textSecondary,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginBottom: 8,
  },
  difficulty: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
});
