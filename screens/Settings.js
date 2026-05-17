import React from 'react';
import { View, Text, StatusBar,ScrollView, StyleSheet,TouchableOpacity } from 'react-native';

import AppLayout from '../components/AppLayout';


export default function Settings({navigation}) {
  return (
    <AppLayout>
      <ScrollView style={styles.container}>

        <Text style={styles.sectionTitle}>
          Preferences
        </Text>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DietaryPreferences' , { fromSettings: true })}>
          <Text style={styles.itemText}>
            Dietary Preferences
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Allergies', { fromSettings: true })}>
          <Text style={styles.itemText}>
            Allergies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('CookingEquipment')}>
          <Text style={styles.itemText}>
            Cooking Equipment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('GroupManagement')}>
          <Text style={styles.itemText}>
            Group Management
          </Text>
        </TouchableOpacity>



        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Payment Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>
            Log Out
          </Text>
        </TouchableOpacity>
        

      </ScrollView>
      
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    padding: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#000000',
  },

  item: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,

    borderWidth: 1,
    borderColor: '#d9d9d9',
  },

  itemText: {
    fontSize: 22,
    color: '#000000',
  },
});
