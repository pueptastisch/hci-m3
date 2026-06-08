import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DietaryPreferences from './screens/DietaryPreferences';
import Allergies from './screens/Allergies';
import Explore from './screens/Explore';
import RecipeDetails from './screens/RecipeDetails';
import MyIngredients from './screens/MyIngredients';
import SavedRecipes from './screens/SavedRecipes';
import Settings from './screens/Settings';
import CookingEquipment from './screens/CookingEquipment';
import GroupManagement from './screens/GroupManagement';
import Welcome from './screens/Welcome';
import Subscription from './screens/Subscription';
import PaymentInfo from './screens/PaymentInfo';
import { AppProvider } from './context/AppContext';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
        />
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
        <Stack.Screen
          name="GroupManagement"
          component={GroupManagement}
        />
        <Stack.Screen
          name="Subscription"
          component={Subscription}
        />
        <Stack.Screen
          name="PaymentInfo"
          component={PaymentInfo}
        />

      </Stack.Navigator>
    </NavigationContainer>
    </AppProvider>
    </SafeAreaProvider>
  );
}