import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';


// simple page with for the user to add the ingredients they have at home

export default function MyIngredients() {

  const [ingredient, setIngredient] = useState('');

  const { myIngredients: ingredients, setMyIngredients: setIngredients } = useContext(AppContext);

  const handleAdd = () => {
    if (ingredient.trim() !== '') {
      setIngredients([
        ...ingredients,
        ingredient.trim()
      ]);
      setIngredient('');
    }
  };

  return (
    <AppLayout title="My Ingredients">

      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View style={styles.headerSection}>
        <View style={styles.addForm}>
          <TextInput
            placeholder="Add new ingredient"
            value={ingredient}
            onChangeText={setIngredient}
            style={styles.input}
            placeholderTextColor={colors.placeholder}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.ingredientsContainer}>

        {ingredients.map((item, index) => (

          <View key={index} style={styles.ingredientRow}>

            <Text style={styles.ingredientText}>
              • {item}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setIngredients(
                  ingredients.filter((_, i) => i !== index)
                );
              }}
            >

              <Image
                source={require('../assets/X.png')}
                style={styles.deleteIcon}
              />

            </TouchableOpacity>

          </View>

        ))}

      </ScrollView>

    </AppLayout>
  );
}

const styles = StyleSheet.create({

  headerSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    ...shadows.sm,
  },

  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  addForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.lg,
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },

  addButton: {
    backgroundColor: colors.brand,
    marginLeft: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  addButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.surface,
  },

  ingredientsContainer: {
    flex: 1,
    padding: spacing.xl,
  },

  ingredientText: {
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
  },

  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },

  deleteIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
