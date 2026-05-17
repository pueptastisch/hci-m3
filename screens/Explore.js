import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

import AppLayout from '../components/AppLayout';
import { getGroups } from '../data/groupsStore';

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
  };

  const handleGenerate = () => {
    const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;

    // Generate logic here
    console.log('Generating with:', {
      ingredients,
      includeMyIngredients,
      mealType,
      preferences,
      includeMyPreferences,
      groupId: selectedGroup ? selectedGroup.id : null,
      groupName: selectedGroup ? selectedGroup.name : null,
      groupMembers: selectedGroup ? selectedGroup.members : [],
    });
  };

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
                color={includeMyIngredients ? '#34C759' : undefined}
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
                color={includeMyPreferences ? '#34C759' : undefined}
              />
              <Text style={styles.checkboxLabel}>Include My Preferences</Text>
            </View>

            <Text style={styles.label}>Group For Recipe Generation</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedGroupId}
                onValueChange={(value) => setSelectedGroupId(value)}
              >
                <Picker.Item label="None" value="none" />
                {groups.map((group) => (
                  <Picker.Item
                    key={group.id}
                    label={`${group.name} (${group.members.length})`}
                    value={group.id}
                  />
                ))}
              </Picker>
            </View>
            {groups.length === 0 ? (
              <Text style={styles.helperText}>
                No groups yet. Create one in Settings {'>'} Group Management.
              </Text>
            ) : null}

            <View style={styles.formActions}>
              <View style={styles.buttonWrapper}>
                <Button title="Clear" onPress={handleClear} color="#888" />
              </View>
              <View style={styles.buttonWrapper}>
                <Button title="Generate Recipe" onPress={handleGenerate} color="#34C759" />
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
    backgroundColor: '#FAF9F6', // optional background color
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#34C759',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#34C759',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
  },
  helperText: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  buttonWrapper: {
    flex: 0.48, // Allows buttons to sit side-by-side easily
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    // Shadows for a card effect
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#d3d3d3',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});
