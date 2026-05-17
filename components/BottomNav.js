import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation , useNavigationState  } from '@react-navigation/native';
import { colors } from '../design/tokens';




const { height } = Dimensions.get('window');

export default function BottomNav() {
  const navigation = useNavigation();

  const activeRoute = useNavigationState(
    state => state.routes[state.index].name
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
        <Image
          source={
            activeRoute  === 'Explore'
              ? require('../assets/HomeActive.png')
              : require('../assets/Home.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MyIngredients')}>
        <Image
          source={
            activeRoute  === 'MyIngredients'
              ? require('../assets/IngredientsActive.png')
              : require('../assets/Ingredients.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SavedRecipes')}>
        <Image
          source={
            activeRoute  === 'SavedRecipes'
              ? require('../assets/SavedActive.png')
              : require('../assets/Saved.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Image
          source={
            activeRoute  === 'Settings'
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
    height: height * (1.5 / 12),
    backgroundColor: colors.background,

    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  icon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});