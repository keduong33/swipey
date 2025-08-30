import { queryOptions } from '@tanstack/react-query';
import { localDb } from '../../storage/indexedDbStorage';
import {
    getListsSupabaseClient,
    getListWithItemsSupabaseClient,
} from './list.api';
import { ListWithItemCount, ListWithItems } from './ListCard';

export const getListsOptions = (isOnline: boolean) => {
    return queryOptions({
        queryKey: ['all-lists'],
        queryFn: async () => {
            if (isOnline) {
                return await getListsSupabaseClient();
            } else {
                const lists = await localDb.getLists();
                if (!lists) return [];
                const list = lists[0];
                const items = await localDb.getItems(list.id);
                return [
                    {
                        ...list,
                        itemCount: items.length,
                    } satisfies ListWithItemCount,
                ];
            }
        },
    });
};

export function getListWithItemsOptions(listId: string) {
    return queryOptions({
        queryKey: ['list', listId],
        queryFn: async (): Promise<ListWithItems | null> => {
            const localList = await localDb.getList(listId);

            if (!localList) {
                return await getListWithItemsSupabaseClient(listId);
            }

            if (localList.isOnline) {
                localDb.deleteListWithItems(listId);
                return await getListWithItemsSupabaseClient(listId);
            }

            const items = await localDb.getItems(listId);

            return {
                ...localList,
                items: items ?? [],
            } satisfies ListWithItems;
        },
    });
}
