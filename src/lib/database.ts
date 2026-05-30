import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  is_bought: number;
}

const DATABASE_NAME = 'shopping_list.db';

// Web-fallback for development
const isWeb = Platform.OS === 'web';

export async function initDatabase() {
  if (isWeb) return null;
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity TEXT DEFAULT '1',
      is_bought INTEGER DEFAULT 0
    );
  `);
  
  return db;
}

export async function getItems(): Promise<ShoppingItem[]> {
  if (isWeb) return [];
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  const allRows = await db.getAllAsync<ShoppingItem>('SELECT * FROM items ORDER BY is_bought ASC, id DESC');
  return allRows;
}

export async function addItem(name: string, quantity: string = '1') {
  if (isWeb) return 0;
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  const result = await db.runAsync(
    'INSERT INTO items (name, quantity) VALUES (?, ?)',
    name,
    quantity
  );
  return result.lastInsertRowId;
}

export async function toggleItemBought(id: number, currentStatus: number) {
  if (isWeb) return;
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  const newStatus = currentStatus === 0 ? 1 : 0;
  await db.runAsync('UPDATE items SET is_bought = ? WHERE id = ?', newStatus, id);
}

export async function deleteItem(id: number) {
  if (isWeb) return;
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.runAsync('DELETE FROM items WHERE id = ?', id);
}

export async function clearAllItems() {
  if (isWeb) return;
  
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.runAsync('DELETE FROM items');
}
