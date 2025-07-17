import { queryOptions } from '@tanstack/react-query';
import {
    getListByUserSupabaseClient,
    getListWithItemsSupabaseClient,
} from './list.api';

export const getListsByUserOptions = (userId?: string) => {
    return queryOptions({
        queryKey: ['lists', userId],
        queryFn: () => getListByUserSupabaseClient(userId),
        enabled: !!userId,
    });
};

export function getListWithItemsOptions(listId: string, isOnline: boolean) {
    return queryOptions({
        queryKey: ['list', listId],
        queryFn: () => getListWithItemsSupabaseClient(listId),
        enabled: isOnline,
    });
}
