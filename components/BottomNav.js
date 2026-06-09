import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, shadows } from '../design/tokens';
import { AppContext } from '../context/AppContext';

export default function BottomNav() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { lastVisitedRecipeId } = React.useContext(AppContext);

  const activeRoute = useNavigationState(
    state => state ? state.routes[state.index].name : 'Explore'
  );

  const handleHomePress = () => {
    if (activeRoute !== 'RecipeDetails' && lastVisitedRecipeId) {
      navigation.navigate('RecipeDetails', { recipeId: lastVisitedRecipeId });
    } else {
      navigation.navigate('Explore');
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.sm }]}>

      <TouchableOpacity style={styles.tab} onPress={handleHomePress}>
        <Image
          source={
            activeRoute === 'Explore' || activeRoute === 'RecipeDetails'
              ? require('../assets/HomeActive.png')
              : require('../assets/Home.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('MyIngredients')}>
        <Image
          source={
            activeRoute === 'MyIngredients'
              ? require('../assets/IngredientsActive.png')
              : require('../assets/Ingredients.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('SavedRecipes')}>
        <Image
          source={
            activeRoute === 'SavedRecipes'
              ? require('../assets/SavedActive.png')
              : require('../assets/Saved.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Settings')}>
        <Image
          source={
            activeRoute === 'Settings'
              ? require('../assets/SettingsActive.png')
              : require('../assets/Settings.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: spacing.sm,
    ...shadows.md,
    elevation: 10,
  },

  tab: {
    padding: spacing.sm,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
