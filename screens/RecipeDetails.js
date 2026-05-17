import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

import AppLayout from '../components/AppLayout';

const DUMMY_RECIPE = {
  title: 'Spaghetti Carbonara',
  description: 'A classic Italian pasta dish made with egg, hard cheese, cured pork, and black pepper.',
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
  const [isSaved, setIsSaved] = useState(false);
  
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
              onPress={() => setIsSaved(!isSaved)}
            >
              <Ionicons 
                name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={28} 
                color={isSaved ? '#34C759' : '#333'} 
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
                      color={checkedIngredients[index] ? '#4630EB' : undefined}
                    />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.exportButtonContainer}>
                <Button title="Export List" onPress={() => console.log('Export hit')} color="#34C759" />
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
                  color="#666"
                />
                <Button 
                  title="Next" 
                  onPress={handleNextStep} 
                  disabled={currentStepIndex === DUMMY_RECIPE.steps.length - 1} 
                  color="#34C759"
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
    backgroundColor: '#fff',
  },
  topSection: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#d3d3d3',
  },
  saveIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
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
  bottomSection: {
    flex: 1,
    padding: 16,
  },
  ingredientsContainer: {
    flex: 1,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  ingredientText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  exportButtonContainer: {
    marginTop: 16,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepCard: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
});
