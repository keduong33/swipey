import { createServerFn, json } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { handlePostgresError } from '../../../integrations/supabase/handleError';
import { getSupabaseServerClient } from '../../../integrations/supabase/serverClient';
import { verifyAuthMiddleWare } from '../../../lib/auth';

export enum CustomErrorCause {
    UPGRADE_REQUIRED = 'UPGRADE_REQUIRED',
}
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

export const itemLimit = 10;
export const addItemSchema = z.object({
    id: z.string(),
    listId: z.string(),
    name: z.string(),
    createdAt: z.string(),
    editedAt: z.string(),
});
export const addItemServerFn = createServerFn({ method: 'POST' })
    .validator(addItemSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ context: { claims }, data }) => {
        const { count, error: countError } = await getSupabaseServerClient()
            .from('Item')
            .select('*, List(userId)', { count: 'exact', head: true })
            .eq('listId', data.listId)
            .eq('List.userId', claims.sub);

        if (countError || count === null) {
            console.error('addItemServerFn - count', countError);
            throw new Error("List not found or doesn't belong to the user");
        }

        if (claims.plan === 'FREE' && count >= itemLimit) {
            throw json(
                {
                    message: 'Upgrade required',
                    cause: CustomErrorCause.UPGRADE_REQUIRED,
                },
                { status: 403 }
            );
        }

        const { error } = await getSupabaseServerClient()
            .from('Item')
            .insert({
                ...data,
            })
            .select();

        if (error) {
            console.error('addItemServerFn', error);
            throw new Error(handlePostgresError(error));
        }
    });
