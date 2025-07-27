import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { handlePostgresError } from '../../../integrations/supabase/handleError';
import { getSupabaseServerClient } from '../../../integrations/supabase/serverClient';
import { verifyAuthMiddleWare } from '../../../lib/auth';

export const updateItemNameSchema = z.object({
    itemId: z.uuidv4(),
    name: z.string(),
});
export const updateItemNameServerFn = createServerFn({ method: 'POST' })
    .validator(updateItemNameSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ data: { name, itemId } }) => {
        const { error } = await getSupabaseServerClient()
            .from('Item')
            .update({
                name,
            })
            .eq('id', itemId);

        if (error) {
            console.error('updateItemNameServerFn', error);
            throw new Error(handlePostgresError(error));
        }
    });

export const removeItemSchema = z.object({
    itemId: z.uuidv4(),
});
export const removeItemServerFn = createServerFn({ method: 'POST' })
    .validator(removeItemSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ data: { itemId } }) => {
        const { error } = await getSupabaseServerClient()
            .from('Item')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('removeItemServerFn', error);
            throw new Error(handlePostgresError(error));
        }
    });
