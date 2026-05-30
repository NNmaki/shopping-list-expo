import { useState, useEffect, useCallback } from 'react';
import * as db from '@/lib/database';
import { ShoppingItem } from '@/lib/database';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const data = await db.getItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await db.initDatabase();
      await fetchItems();
    };
    init();
  }, [fetchItems]);

  const handleAddItem = async (name: string, quantity: string) => {
    if (!name.trim()) return;
    try {
      await db.addItem(name, quantity);
      await fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleToggleBought = async (id: number, currentStatus: number) => {
    try {
      await db.toggleItemBought(id, currentStatus);
      await fetchItems();
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await db.deleteItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await db.clearAllItems();
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
