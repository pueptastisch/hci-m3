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

import AppLayout from './components/AppLayout';

export default function MyIngredients() {

  const [popupVisible, setPopupVisible] = useState(false);

  const [ingredient, setIngredient] = useState('');

  const [ingredients, setIngredients] = useState([]);

  return (
    <AppLayout>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EDEDED"
      />

      <View style={styles.topRow}>

        <TouchableOpacity
          onPress={() => setPopupVisible(true)}
        >
          <Image
            source={require('./assets/Add.png')}
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
                source={require('./assets/X.png')}
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
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
  },

  addIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  ingredientsContainer: {
    flex: 1,
    padding: 20,
  },

  ingredientText: {
    fontSize: 28,
    marginBottom: 15,
    color: '#000000',
  },

  popup: {
    position: 'absolute',

    top: '35%',
    left: 20,
    right: 20,

    backgroundColor: '#FFFFFF',

    padding: 20,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#d9d9d9',
  },

  input: {
    borderWidth: 1,
    borderColor: '#c0bfbf',

    borderRadius: 10,

    padding: 15,

    fontSize: 22,

    marginBottom: 20,
  },

  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  backButton: {
    backgroundColor: '#CFF7D3',

    paddingVertical: 12,
    paddingHorizontal: 50,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#34C759',
  },

  addButton: {
    backgroundColor: '#34C759',

    paddingVertical: 12,
    paddingHorizontal: 50,

    borderRadius: 12,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  ingredientRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  marginBottom: 15,
},

  deleteIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});