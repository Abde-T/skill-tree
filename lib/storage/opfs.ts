import type { Todo } from '@/types';

const STORAGE_DIR = 'skill-tree';
const TODOS_FILE = 'todos.json';

// ─── OPFS Helpers ─────────────────────────────────────────────────────────────

async function getStorageDir(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return await root.getDirectoryHandle(STORAGE_DIR, { create: true });
}

async function getTodosFile(): Promise<File> {
  const dir = await getStorageDir();
  const fileHandle = await dir.getFileHandle(TODOS_FILE, { create: true });
  const file = await fileHandle.getFile();
  return file;
}

// ─── Todo Storage ─────────────────────────────────────────────────────────────

export async function loadTodos(): Promise<Record<string, Todo>> {
  try {
    const file = await getTodosFile();
    const text = await file.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch (err) {
    console.error('[Storage] Failed to load todos:', err);
    return {};
  }
}

export async function saveTodos(todos: Record<string, Todo>): Promise<void> {
  try {
    const dir = await getStorageDir();
    const fileHandle = await dir.getFileHandle(TODOS_FILE, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(todos, null, 2));
    await writable.close();
    console.log('[Storage] Saved todos');
  } catch (err) {
    console.error('[Storage] Failed to save todos:', err);
  }
}

export async function clearTodos(): Promise<void> {
  try {
    const dir = await getStorageDir();
    await dir.removeEntry(TODOS_FILE);
    console.log('[Storage] Cleared todos');
  } catch (err) {
    console.error('[Storage] Failed to clear todos:', err);
  }
}

// ─── Check Availability ───────────────────────────────────────────────────────

export function isOPFSAvailable(): boolean {
  return typeof window !== 'undefined' && 'getDirectory' in navigator.storage;
}
