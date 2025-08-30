// storage/indexedDbStorage.ts

import { Result } from '../hooks/useGetResult';
import { BaseList } from '../pages/list/ListCard';
import { Item } from '../pages/list/ListItem';
import { getDb } from './db';

export interface IndexedDbStorage {
    // Lists
    getLists(): Promise<BaseList[] | undefined>;
    getList(id: string): Promise<BaseList | undefined>;
    saveList(list: BaseList): Promise<void>;
    saveLists(lists: BaseList[]): Promise<void>;
    deleteList(id: string): Promise<void>;

    // Items
    getItems(id: string): Promise<Item[]>;
    saveItem(item: Item): Promise<void>;
    deleteItem(id: string): Promise<void>;

    // Rankings
    saveResult(result: Result): Promise<void>;
    saveResults(results: Result[]): Promise<void>;
    getResults(): Promise<Result[] | undefined>;
    getResult(id: string): Promise<Result | undefined>;
    deleteResult(id: string): Promise<void>;

    deleteListWithItems(listId: string): Promise<void>;
}

export const localDb: IndexedDbStorage = {
    // Lists
    async getLists() {
        try {
            const db = await getDb();
            return db.getAll('lists');
        } catch (error) {
            handleError(error);
        }
    },

    async getList(id: string) {
        try {
            const db = await getDb();
            return db.get('lists', id);
        } catch (error) {
            handleError(error);
        }
    },

    async saveList(list) {
        try {
            const db = await getDb();
            await db.put('lists', list);
        } catch (error) {
            handleError(error);
        }
    },

    async saveLists(lists) {
        try {
            const db = await getDb();
            const tx = db.transaction('lists', 'readwrite');
            for (const list of lists) {
                await tx.store.put(list);
            }
            await tx.done;
        } catch (error) {
            handleError(error);
        }
    },

    async deleteList(id: string) {
        try {
            const db = await getDb();
            await db.delete('lists', id);
        } catch (error) {
            handleError(error);
        }
    },

    async getItems(listId) {
        try {
            const db = await getDb();
            const tx = db.transaction('items');
            const index = tx.store.index('listId');
            const items = await index.getAll(listId);
            return items;
        } catch (error) {
            handleError(error);
            return [];
        }
    },

    async saveItem(item) {
        try {
            const db = await getDb();
            await db.put('items', item);
        } catch (error) {
            handleError(error);
        }
    },

    async deleteItem(id) {
        try {
            const db = await getDb();
            await db.delete('items', id);
        } catch (error) {
            handleError(error);
        }
    },

    async saveResult(result: Result) {
        try {
            const db = await getDb();
            await db.put('results', result);
        } catch (error) {
            handleError(error);
        }
    },

    async saveResults(results: Result[]) {
        try {
            const db = await getDb();
            const tx = db.transaction('results', 'readwrite');
            for (const result of results) {
                await tx.store.put(result);
            }
            await tx.done;
        } catch (error) {
            handleError(error);
        }
    },

    async getResult(id: string) {
        try {
            const db = await getDb();
            return db.get('results', id);
        } catch (error) {
            handleError(error);
        }
    },

    async getResults() {
        try {
            const db = await getDb();
            return db.getAll('results');
        } catch (error) {
            handleError(error);
        }
    },

    async deleteResult(id: string) {
        try {
            const db = await getDb();
            await db.delete('results', id);
        } catch (error) {
            handleError(error);
        }
    },

    async deleteListWithItems(listId) {
        try {
            const db = await getDb();
            const tx = db.transaction(['lists', 'items'], 'readwrite');

            // Delete the list
            await tx.objectStore('lists').delete(listId);

            // Get all item keys by index (listId)
            const index = tx.objectStore('items').index('listId');
            const itemKeys = await index.getAllKeys(listId);

            // Schedule all deletes (don't await individually inside loop)
            const deletePromises = itemKeys.map((key) =>
                tx.objectStore('items').delete(key)
            );

            // Wait for all deletes to complete
            await Promise.all(deletePromises);

            // Finish the transaction
            await tx.done;
        } catch (error) {
            handleError(error);
        }
    },
};

function handleError(error: unknown) {
    if (error instanceof DOMException) {
        switch (error.name) {
            case 'QuotaExceededError':
                alert('Storage full — try deleting some saved data.');
                break;
            case 'NotFoundError':
                alert(
                    'Could not find expected data — the list may be corrupted.'
                );
                break;
            case 'InvalidStateError':
                alert(
                    'Database is in an invalid state. Try refreshing the page.'
                );
                break;
            default:
                alert('Something went wrong with local storage.');
        }
        console.error('DOMException', error);
    } else {
        console.error('Unknown error:', error);
        alert('An unexpected error occurred.');
    }
}
