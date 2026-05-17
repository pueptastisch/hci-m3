import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DietaryPreferences from './DietaryPreferences';
import Allergies from './Allergies';
import Explore from './Explore';
import RecipeDetails from './RecipeDetails';
import MyIngredients from './MyIngredients';
import SavedRecipes from './SavedRecipes';
import Settings from './Settings';
import CookingEquipment from './CookingEquipment';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DietaryPreferences"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="DietaryPreferences"
          component={DietaryPreferences}
        />
        <Stack.Screen
          name="Allergies"
          component={Allergies}
        />
        <Stack.Screen
          name="Explore"
          component={Explore}
        />
        <Stack.Screen
          name="MyIngredients"
          component={MyIngredients}
        />
        <Stack.Screen
          name="SavedRecipes"
          component={SavedRecipes}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
        />
        <Stack.Screen
          name="CookingEquipment"
          component={CookingEquipment}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}