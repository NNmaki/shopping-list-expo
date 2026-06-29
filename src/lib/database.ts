import { type SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  is_bought: number;
}

// Web-fallback for development
const isWeb = Platform.OS === 'web';

export async function initDatabase(db: SQLiteDatabase) {
  if (isWeb) return;
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity TEXT DEFAULT '1',
      is_bought INTEGER DEFAULT 0
    );
  `);
}

export async function getItems(db: SQLiteDatabase | null): Promise<ShoppingItem[]> {
  if (isWeb || !db) return [];
  
  const allRows = await db.getAllAsync<ShoppingItem>('SELECT * FROM items ORDER BY is_bought ASC, id DESC');
  return allRows;
}

export async function addItem(db: SQLiteDatabase | null, name: string, quantity: string = '1') {
  if (isWeb || !db) return 0;
  
  const result = await db.runAsync(
    'INSERT INTO items (name, quantity) VALUES (?, ?)',
    name,
    quantity
  );
  return result.lastInsertRowId;
}

export async function toggleItemBought(db: SQLiteDatabase | null, id: number, currentStatus: number) {
  if (isWeb || !db) return;
  
  const newStatus = currentStatus === 0 ? 1 : 0;
  await db.runAsync('UPDATE items SET is_bought = ? WHERE id = ?', newStatus, id);
}

export async function deleteItem(db: SQLiteDatabase | null, id: number) {
  if (isWeb || !db) return;
  
  await db.runAsync('DELETE FROM items WHERE id = ?', id);
}

export async function clearAllItems(db: SQLiteDatabase | null) {
  if (isWeb || !db) return;
  
  await db.runAsync('DELETE FROM items');
}

