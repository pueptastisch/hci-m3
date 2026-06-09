import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, shadows, fontSizes, fontWeights } from '../design/tokens';
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

  const isHomeActive = activeRoute === 'Explore' || activeRoute === 'RecipeDetails';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.sm }]}>

      <TouchableOpacity style={styles.tab} onPress={handleHomePress}>
        <Image
          source={
            isHomeActive
              ? require('../assets/HomeActive.png')
              : require('../assets/Home.png')
          }
          style={styles.icon}
        />
        <Text style={[styles.tabLabel, isHomeActive && styles.activeTabLabel]}>Home</Text>
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
        <Text style={[styles.tabLabel, activeRoute === 'MyIngredients' && styles.activeTabLabel]}>Ingredients</Text>
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
        <Text style={[styles.tabLabel, activeRoute === 'SavedRecipes' && styles.activeTabLabel]}>Saved</Text>
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
        <Text style={[styles.tabLabel, activeRoute === 'Settings' && styles.activeTabLabel]}>Settings</Text>
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
    paddingTop: spacing.xs,
    ...shadows.md,
    elevation: 10,
  },

  tab: {
    padding: spacing.xs,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: fontSizes.xs - 2,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },

  activeTabLabel: {
    color: colors.brand,
    fontWeight: fontWeights.bold,
  },
});
