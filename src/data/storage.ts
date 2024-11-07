import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/index';

const STORAGE_KEY = 'contact_list';

export const saveItems = async (items: Item[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items', error);
  }
};

export const loadItems = async (): Promise<Item[]> => {
  try {
    const items = await AsyncStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading items', error);
    return [];
  }
};
