import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { supabaseClient } from '../../../../integrations/supabase/browserClient';
import {
    removeItemSchema,
    removeItemServerFn,
    updateItemNameSchema,
    updateItemNameServerFn,
} from '../edit_item.api';

export const useOnlineItemEdit = () => {
    const updateItemNameFn = useServerFn(updateItemNameServerFn);
    const updateItemNameMutation = useMutation({
        mutationFn: async ({
            data,
        }: {
            data: {
                itemId: string;
                name: string;
            };
        }) => {
            const { itemId, name } = updateItemNameSchema.parse(data);

            await supabaseClient
                .from('Item')
                .update({ name })
                .eq('id', itemId)
                .throwOnError();
        },
        onError: () => {
            alert('Failed to save item name');
        },
    });

    const removeItemFn = useServerFn(removeItemServerFn);
    const removeItemMutation = useMutation({
        mutationFn: async ({ data }: { data: { itemId: string } }) => {
            const { itemId } = removeItemSchema.parse(data);

            await supabaseClient
                .from('Item')
                .delete()
                .eq('id', itemId)
                .throwOnError();
        },
        onError: () => {
            alert('Failed to save item name');
        },
    });

    return { updateItemNameMutation, removeItemMutation };
};
