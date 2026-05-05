export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to save key "${key}" to localStorage.`, error);
    return false;
  }
}

export function getFromStorage(key, fallback = null) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return fallback;
    }

    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Failed to parse key "${key}" from localStorage.`, error);
    return fallback;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove key "${key}" from localStorage.`, error);
    return false;
  }
}

export function clearStorageKey(key) {
  return removeFromStorage(key);
}
