import { useMutation } from '@tanstack/react-query';
import { supabaseClient } from '../../../../integrations/supabase/browserClient';
import { updateListDescriptionSchema, updateListNameSchema } from '../edit.api';

export const useOnlineEdit = () => {
    // const updateListNameFn = useServerFn(updateListNameServerFn);
    const listNameMutation = useMutation({
        mutationFn: async ({
            data,
        }: {
            data: { name: string; listId: string };
        }) => {
            const { listId, name } = updateListNameSchema.parse(data);

            await supabaseClient
                .from('List')
                .update({
                    name,
                })
                .eq('id', listId)
                .throwOnError();
        },
        onError: () => {
            alert('Failed to save list name');
        },
    });

    // const updateListDescriptionFn = useServerFn(updateListDescriptionServerFn);
    const listDescriptionMutation = useMutation({
        mutationFn: async ({
            data,
        }: {
            data: { description: string; listId: string };
        }) => {
            const { description, listId } =
                updateListDescriptionSchema.parse(data);

            await supabaseClient
                .from('List')
                .update({
                    description,
                })
                .eq('listId', listId)
                .throwOnError();
        },
        onError: () => {
            alert('Failed to save list description');
        },
    });

    return {
        listDescriptionMutation,
        listNameMutation,
    };
};
