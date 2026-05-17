import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [cookingEquipment, setCookingEquipment] = useState([]);
  const [myIngredients, setMyIngredients] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  return (
    <AppContext.Provider value={{
      dietaryPreferences, setDietaryPreferences,
      allergies, setAllergies,
      cookingEquipment, setCookingEquipment,
      myIngredients, setMyIngredients,
      savedRecipes, setSavedRecipes,
    }}>
      {children}
    </AppContext.Provider>
  );
};
