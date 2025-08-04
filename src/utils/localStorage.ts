/**
 * Utility functions for managing localStorage with error handling
 */

export const LocalStorage = {
  /**
   * Save data to localStorage with error handling
   */
  save: function<T>(key: string, data: T): boolean {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(`aura_${key}`, serializedData);
      console.log(`Data saved to localStorage: ${key}`);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  /**
   * Load data from localStorage with error handling
   */
  load: function<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`aura_${key}`);
      if (data === null) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove data from localStorage with error handling
   */
  remove: function(key: string): boolean {
    try {
      localStorage.removeItem(`aura_${key}`);
      console.log(`Data removed from localStorage: ${key}`);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: function(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get all keys with the aura prefix
   */
  getAllKeys: function(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('aura_')) {
          keys.push(key.replace('aura_', ''));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  /**
   * Clear all aura-related data from localStorage
   */
  clearAll: function(): boolean {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => {
        localStorage.removeItem(`aura_${key}`);
      });
      console.log('All aura data cleared from localStorage');
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Hook for using localStorage in React components
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get initial value from localStorage or use provided initial value
  const getStoredValue = (): T => {
    if (!LocalStorage.isAvailable()) {
      return initialValue;
    }
    
    const stored = LocalStorage.load<T>(key);
    return stored !== null ? stored : initialValue;
  };

  const [storedValue, setStoredValue] = React.useState<T>(getStoredValue);

  // Update localStorage when state changes
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      LocalStorage.save(key, value);
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Import React for the hook
import React from 'react';
