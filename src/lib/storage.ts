import { openDB, IDBPDatabase } from 'idb';

export type FileType = 'document' | 'spreadsheet' | 'presentation';

export interface OfficeFile {
  id: string;
  name: string;
  type: FileType;
  content: any;
  lastModified: number;
}

const DB_NAME = 'lumina_office_db';
const STORE_NAME = 'files';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export const storage = {
  async getAllFiles(): Promise<OfficeFile[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  },

  async saveFile(file: OfficeFile): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, {
      ...file,
      lastModified: Date.now(),
    });
  },

  async getFile(id: string): Promise<OfficeFile | undefined> {
    const db = await getDB();
    return db.get(STORE_NAME, id);
  },

  async deleteFile(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  }
};
