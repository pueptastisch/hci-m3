import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [cookingEquipment, setCookingEquipment] = useState([]);
  const [myIngredients, setMyIngredients] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const resetApp = () => {
    setUsername('');
    setDietaryPreferences([]);
    setAllergies([]);
    setCookingEquipment([]);
    setMyIngredients([]);
    setSavedRecipes([]);
  };

  return (
    <AppContext.Provider value={{
      username, setUsername,
      dietaryPreferences, setDietaryPreferences,
      allergies, setAllergies,
      cookingEquipment, setCookingEquipment,
      myIngredients, setMyIngredients,
      savedRecipes, setSavedRecipes,
      resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
};
