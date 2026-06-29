import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as db from '@/lib/database';
import { ShoppingItem } from '@/lib/database';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve SQLite context on native platforms only
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sqliteDb = Platform.OS === 'web' ? null : useSQLiteContext();

  const fetchItems = useCallback(async () => {
    try {
      const data = await db.getItems(sqliteDb);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sqliteDb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (name: string, quantity: string) => {
    if (!name.trim()) return;
    try {
      await db.addItem(sqliteDb, name, quantity);
      await fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleToggleBought = async (id: number, currentStatus: number) => {
    try {
      await db.toggleItemBought(sqliteDb, id, currentStatus);
      await fetchItems();
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await db.deleteItem(sqliteDb, id);
      await fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await db.clearAllItems(sqliteDb);
      await fetchItems();
    } catch (error) {
      console.error('Failed to clear items:', error);
    }
  };

  return {
    items,
    isLoading,
    addItem: handleAddItem,
    toggleBought: handleToggleBought,
    deleteItem: handleDeleteItem,
    clearAll: handleClearAll,
    refresh: fetchItems,
  };
}

