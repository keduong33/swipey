import { localDb } from '../../../../storage/indexedDbStorage';
import { BaseList } from '../../ListCard';
import { Item } from '../../ListItem';

export const useOfflineEdit = () => {
    const saveListLocally = async (list: BaseList) => {
        await localDb.saveList(list);
    };
    const deleteListLocally = async (id: string) => {
        await localDb.deleteList(id);
        for (const item of await localDb.getItems(id)) {
            deleteItemLocally(item.id);
        }
    };

    const saveItemLocally = async (item: Item) => {
        await localDb.saveItem(item);
    };

    const deleteItemLocally = async (id: string) => {
        await localDb.deleteItem(id);
    };

    return {
        saveItemLocally,
        saveListLocally,
        deleteListLocally,
        deleteItemLocally,
    };
};
