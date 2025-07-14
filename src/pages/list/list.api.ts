import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../integrations/supabase/serverClient';
import { ListWithItemCount } from './ListCard';

export const getListsByUser = createServerFn({ method: 'GET' }).handler(
    async (): Promise<ListWithItemCount[]> => {
        const supabase = getSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

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
