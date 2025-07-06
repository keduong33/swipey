import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Result } from '../hooks/useGetResult';
import { List } from '../pages/list/ListCard';
import { Item } from '../pages/list/ListItem';

// ---------------- Schema ----------------

interface SwipeyDB extends DBSchema {
    lists: {
        key: string;
        value: List;
    };
    items: {
        key: string;
        value: Item;
        indexes: { listId: string };
    };
    results: {
        key: string;
        value: Result;
    };
}

// ---------------- DB Init ----------------

let dbPromise: Promise<IDBPDatabase<SwipeyDB>> | null = null;

export function getDb() {
    if (!dbPromise) {
        if (typeof window === 'undefined') {
            throw new Error('IndexedDB not available on server');
        }
        dbPromise = openDB<SwipeyDB>('SwipeyDB', 1, {
            upgrade(db) {
                db.createObjectStore('lists', { keyPath: 'id' });
                db.createObjectStore('results', { keyPath: 'id' });
            },
        });
    }
    return dbPromise;
}
