import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { supabaseClient } from '../../integrations/supabase/browserClient';
import { nonExistingRow } from '../../integrations/supabase/handleError';
import { getSupabaseServerClient } from '../../integrations/supabase/serverClient';
import { getAccessToken } from '../auth/auth.api';
import { ListWithItemCount, ListWithItems } from './ListCard';

/**
 * Server function
 */
export const getListsByUser = createServerFn({ method: 'GET' }).handler(
    async (): Promise<ListWithItemCount[]> => {
        const accessToken = getAccessToken(getWebRequest().headers);
        const supabase = getSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error('authError', authError);
            return [];
        }

        const { data: lists, error: listError } = await supabase
            .from('List')
            .select(`*, Item(count)`)
            .eq('userId', user.id);

        if (listError) {
            console.error('getListsByUser:', listError);
            return [];
        }

        if (lists) {
            return lists.map((list) => {
                return {
                    ...list,
                    itemCount: list.Item[0].count,
                } satisfies ListWithItemCount;
            });
        }

        return [];
    }
);

export const getListByUserSupabaseClient = async (userId?: string) => {
    if (!userId) {
        throw new Error('No user id to find lists belong to them');
    }
    const { data, error } = await supabaseClient
        .from('List')
        .select(`*, Item(count)`)
        .eq('userId', userId);

    if (error) {
        console.error('getListsByUserSupabaseClient:', error);
        return [];
    }

    if (data) {
        return data.map((list) => {
            return {
                ...list,
                itemCount: list.Item[0].count,
            } satisfies ListWithItemCount;
        });
    }

    return [];
};

export const getListsSupabaseClient = async () => {
    const { data, error } = await supabaseClient
        .from('List')
        .select(`*, Item(count)`);

    if (error) {
        console.error('getListsSupabaseClient:', error);
        return [];
    }

    if (data) {
        return data.map((list) => {
            return {
                ...list,
                itemCount: list.Item[0].count,
            } satisfies ListWithItemCount;
        });
    }

    return [];
};

const getWithItemsSchema = z.object({
    listId: z.string(),
});

/**
 * Server function
 */
export const getListWithItems = createServerFn({ method: 'GET' })
    .validator(getWithItemsSchema)
    .handler(async ({ data: { listId } }): Promise<ListWithItems | null> => {
        const accessToken = getAccessToken(getWebRequest().headers);
        const supabase = getSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error('authError', authError);
            return null;
        }

        const { data, error } = await supabase
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
    });

export const getListWithItemsSupabaseClient = async (listId: string) => {
    const { data, error } = await supabaseClient
        .from('List')
        .select(`*, Item(*)`) // Join all fields from Item
        .eq('id', listId)
        .single(); // return one row, not array

    if (error) {
        if (error.code === nonExistingRow) {
            throw new Error('There is no such list');
        }
        console.error('getListWithItemsSupabaseClient', error);
        throw new Error(`Failed to get items of the list ${listId}`);
    }

    if (data) {
        const { Item: items, ...list } = data;
        return {
            ...list,
            items: items ?? [],
        };
    }

    return null;
};
