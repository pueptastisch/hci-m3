
// mocked users with dietary preferences for prototype recipe generation
export const USERS = [
  { username: 'jason', dietaryPreferences: ['Vegetarian', 'Keto'] },
  { username: 'anna', dietaryPreferences: ['Gluten Free'] },
  { username: 'maria', dietaryPreferences: ['Halal'] },
  { username: 'david', dietaryPreferences: ['Keto'] },
  { username: 'sophia', dietaryPreferences: ['Vegan'] },
  { username: 'michael', dietaryPreferences: ['Dairy Free'] },
  { username: 'emma', dietaryPreferences: ['Pescatarian'] },
  { username: 'daniel', dietaryPreferences: ['Kosher'] },
  { username: 'olivia', dietaryPreferences: ['Diabetic Friendly'] },
  { username: 'james', dietaryPreferences: ['Hindu Vegetarian'] },
];

export const AVAILABLE_USERNAMES = USERS.map((user) => user.username);

function normalize(value) {
  return value.trim().toLowerCase();
}

export function getUserByUsername(username) {
  const normalizedInput = normalize(username);
  return USERS.find((user) => normalize(user.username) === normalizedInput) || null;
}

export function userExists(username) {
  return getUserByUsername(username) !== null;
}

export function getDietaryPreferencesForUsernames(usernames) {
  const collected = [];

  usernames.forEach((username) => {
    const user = getUserByUsername(username);
    if (!user) {
      return;
    }

    user.dietaryPreferences.forEach((preference) => {
      const exists = collected.some(
        (existing) => existing.toLowerCase() === preference.toLowerCase()
      );
      if (!exists) {
        collected.push(preference);
      }
    });
  });

  return collected;
}
