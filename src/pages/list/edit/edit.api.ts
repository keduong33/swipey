import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { handlePostgresError } from '../../../integrations/supabase/handleError';
import { getSupabaseServerClient } from '../../../integrations/supabase/serverClient';
import { verifyAuthMiddleWare } from '../../../lib/auth';
import { getAccessToken } from '../../auth/auth.api';

const updateListNameSchema = z.object({
    name: z.string().nonempty('Name cannot be empty'),
    listId: z.string(),
});

export const updateListNameServerFn = createServerFn({ method: 'POST' })
    .validator(updateListNameSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ data: { listId, name } }) => {
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

        const { data, error } = await getSupabaseServerClient()
            .from('List')
            .update({
                name,
            })
            .eq('id', listId)
            .select('name')
            .single();

        if (error || !data) {
            console.error('updateListName', error);
            throw new Error(handlePostgresError(error));
        }
    });

const updateListDescriptionSchema = z.object({
    description: z.string(),
    listId: z.string(),
});

export const updateListDescriptionServerFn = createServerFn({ method: 'POST' })
    .validator(updateListDescriptionSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ data: { listId, description } }) => {
        const { data, error } = await getSupabaseServerClient()
            .from('List')
            .update({
                description,
            })
            .eq('id', listId)
            .select('description')
            .single();

        if (error || !data) {
            console.error('updateListDescription', error);
            throw new Error(handlePostgresError(error));
        }
    });

const createNewListSchema = z.object({
    listId: z.string(),
});

export const createNewList = createServerFn({ method: 'POST' })
    .validator(createNewListSchema)
    .middleware([verifyAuthMiddleWare])
    .handler(async ({ data: { listId }, context: { user } }) => {
        const { error } = await getSupabaseServerClient().from('List').insert({
            id: listId,
            name: 'New list',
            userId: user.id,
        });

        if (error) {
            console.error('createNewList', error);
            throw new Error(handlePostgresError(error));
        }

        return listId;
    });
