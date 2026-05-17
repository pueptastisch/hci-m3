import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DietaryPreferences from './screens/DietaryPreferences';
import Allergies from './screens/Allergies';
import Explore from './screens/Explore';
import RecipeDetails from './screens/RecipeDetails';
import MyIngredients from './screens/MyIngredients';
import SavedRecipes from './screens/SavedRecipes';
import Settings from './screens/Settings';
import CookingEquipment from './screens/CookingEquipment';
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
          name="RecipeDetails"
          component={RecipeDetails}
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