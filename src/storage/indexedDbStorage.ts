// storage/indexedDbStorage.ts

import { Result } from '../hooks/useGetResult';
import { List } from '../pages/list/listCard';
import { getDb } from './db';

export interface IndexedDbStorage {
    // Lists
    getLists(): Promise<List[] | undefined>;
    getList(id: string): Promise<List | undefined>;
    saveList(list: List): Promise<void>;
    saveLists(lists: List[]): Promise<void>;
    deleteList(id: string): Promise<void>;

    // Rankings
    saveResult(result: Result): Promise<void>;
    saveResults(results: Result[]): Promise<void>;
    getResults(): Promise<Result[] | undefined>;
    getResult(id: string): Promise<Result | undefined>;
    deleteResult(id: string): Promise<void>;
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

    async saveList(list: List) {
        try {
            const db = await getDb();
            await db.put('lists', list);
        } catch (error) {
            handleError(error);
        }
    },

    async saveLists(lists: List[]) {
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
                console.error('IndexedDB error:', error);
                alert('Something went wrong with local storage.');
        }
    } else {
        console.error('Unknown error:', error);
        alert('An unexpected error occurred.');
    }
}
