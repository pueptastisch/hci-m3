import React, { useState } from 'react';
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
} from '../design/tokens';

export default function MyIngredients() {

  const [popupVisible, setPopupVisible] = useState(false);

  const [ingredient, setIngredient] = useState('');

  const [ingredients, setIngredients] = useState([]);

  return (
    <AppLayout>

      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View style={styles.topRow}>
        <Text style={styles.headerTitle}>My Ingredients</Text>
        <TouchableOpacity
          onPress={() => setPopupVisible(true)}
        >
          <Image
            source={require('../assets/Add.png')}
            style={styles.addIcon}
          />
        </TouchableOpacity>

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

      {popupVisible && (

        <View style={styles.popup}>

          <TextInput
            placeholder="Enter ingredient"
            value={ingredient}
            onChangeText={setIngredient}
            style={styles.input}
          />

          <View style={styles.popupButtons}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.buttonText}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {

                if (ingredient.trim() !== '') {

                  setIngredients([
                    ...ingredients,
                    ingredient
                  ]);

                  setIngredient('');
                }

              }}
            >
              <Text style={styles.buttonText}>
                Add
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      )}

    </AppLayout>
  );
}

const styles = StyleSheet.create({

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm + 2,
  },

  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
  },

  addIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  ingredientsContainer: {
    flex: 1,
    padding: spacing.xl,
  },

  ingredientText: {
    fontSize: fontSizes.xxxl,
    marginBottom: spacing.lg - 1,
    color: colors.textPrimary,
  },

  popup: {
    position: 'absolute',

    top: '35%',
    left: 20,
    right: 20,

    backgroundColor: colors.surface,

    padding: spacing.xl,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.borderMuted,

    borderRadius: radii.sm + 2,

    padding: spacing.md + 3,

    fontSize: fontSizes.xl + 2,

    marginBottom: spacing.xl,
  },

  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  backButton: {
    backgroundColor: '#CFF7D3',

    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl + 30,

    borderRadius: radii.md,

    borderWidth: 1,
    borderColor: colors.brand,
  },

  addButton: {
    backgroundColor: colors.brand,

    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl + 30,

    borderRadius: radii.md,
  },

  buttonText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  ingredientRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  marginBottom: spacing.lg - 1,
},

  deleteIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
