
//mocked users 

export const AVAILABLE_USERNAMES = ['jason', 'anna', 'maria', 'david', 'sophia', 'michael', 'emma', 'daniel', 'olivia', 'james'];

export function userExists(username) {
  const normalizedInput = username.trim().toLowerCase();
  return AVAILABLE_USERNAMES.some((name) => name.toLowerCase() === normalizedInput);
}
