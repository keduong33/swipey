import { queryOptions } from '@tanstack/react-query';
import { supabaseClient } from '../../integrations/supabase/browserClient';
import { ListWithItems } from './ListCard';
import { getListsByUser } from './list.api';

export const getListsByUserOptions = () => {
    return queryOptions({
        queryKey: ['lists'],
        queryFn: getListsByUser,
        staleTime: 300000, // 5 minutes
        retry: false,
        enabled: false,
    });
};

// export const getListsByUserOptions = (userId: string) => {
//     return queryOptions({
//         queryKey: ['lists'],
//         queryFn: async () => {
//             const { data: lists, error } = await supabaseClient
//                 .from('List')
//                 .select(
//                     `*,
//                     Item(count)
//                     `
//                 )
//                 .eq('userId', userId);
//             if (error) {
//                 console.error('getLists', error);
//                 return [];
//             }

//             if (lists) {
//                 return lists.map((list) => {
//                     return {
//                         ...list,
//                         itemCount: list.Item[0].count,
//                     } satisfies ListWithItemCount;
//                 });
//             }

//             return [];
//         },
//         staleTime: 300000, // 5 minutes
//     });
// };

export function getListWithItemsOptions(listId: string) {
    return queryOptions({
        queryKey: ['list', listId],
        queryFn: async (): Promise<ListWithItems | null> => {
            const { data, error } = await supabaseClient
                .from('List')
                .select(`*, Item(*)`) // Join all fields from Item
                .eq('id', listId)
                .single(); // return one row, not array

            if (error) {
                console.error('getListWithItems', error);
                return null;
            }

            if (data) {
                const { Item: items, ...list } = data;
                return {
                    ...list,
                    items: items ?? [],
                };
            }

            return null;
        },
        staleTime: 300_000, // 5 minutes
    });
}
