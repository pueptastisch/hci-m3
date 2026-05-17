import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppLayout from '../components/AppLayout';

export default function SavedRecipes({ navigation }) {
  const [savedRecipes, setSavedRecipes] = useState([
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish made with egg, hard cheese, cured pork, and black pepper.',
      difficulty: '2/5',
      image: 'https://img.chefkoch-cdn.de/rezepte/1298241234947062/bilder/1616493/crop-640x427/carbonara-wie-bei-der-mamma-in-rom.jpg',
    }
  ]);

  const handleDelete = (id) => {
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
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
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Saved Recipes</Text>
        {savedRecipes.length > 0 ? (
          <FlatList
            data={savedRecipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeItem}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved recipes!</Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
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
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  }
});
