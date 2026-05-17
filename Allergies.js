import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const { height } = Dimensions.get('window');

export default function Allergies({ navigation, route }) {

  const [selected, setSelected] = useState([]);

  const options = [
    'Peanuts',
    'Tree Nuts',
    'Dairy',
    'Eggs',
    'Fish',
    'Shellfish',
    'Gluten',
    'Soy',
    'Sesame',
  ];

  return (
    <View style={styles.screen}>

      <View style={styles.container}>
        <Text style={styles.logo}>
          Allergies
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          Choose your Allergies
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>

        {options.map(item => (
          <View key={item} style={styles.options}>

            <CheckBox
              value={selected.includes(item)}
              onValueChange={() => {
                if (selected.includes(item)) {
                  setSelected(selected.filter(i => i !== item));
                } else {
                  setSelected([...selected, item]);
                }
              }}
            />

            <Text style={styles.optionstext}>
              {item}
            </Text>

          </View>
        ))}

      </ScrollView>

      <View style={styles.bottomSection}>

        <TouchableOpacity style={styles.leftButton} onPress={() => {
                                                              if (route.params?.fromSettings) {
                                                                  navigation.goBack();
                                                              } else {
                                                                navigation.navigate('Explore');
                                                              }}}>
          <Text style={styles.leftButtonText}>
            setup later
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightButton} onPress={() => {
                                                              if (route.params?.fromSettings) {
                                                                  navigation.goBack();
                                                              } else {
                                                                navigation.navigate('Explore');
                                                              }}}>
          <Text style={styles.rightButtonText}>
            choose selected
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },

  container: {
    height: height * (2 / 12),
    backgroundColor: '#EDEDED',
    borderBottomWidth: 1,
    borderBottomColor: '#c0bfbf',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    fontSize: 40,
    color: '#34C759',
    fontFamily: 'Jaini',
  },
  content: {
    
  },

  description: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  descriptionText: {
    color: '#000000',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 25,
    textAlign: 'center',
  },

  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginBottom: 20,
    },
  optionstext: {
    color: '#000000',
    fontSize: 26,
  },

  bottomSection: {
    height: height * (2 / 12),

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  leftButton: {
    width: 190,
    height: 70,

    borderWidth: 1,

    backgroundColor: '#CFF7D3',

    borderColor: '#34C759',
    
    borderRadius: 12,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightButton: {
    width: 190,
    height: 70,

    backgroundColor: '#34C759',

    borderRadius: 12,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },

  rightButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});