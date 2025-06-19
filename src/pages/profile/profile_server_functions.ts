import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../lib/supabase';
import { GenericServerError } from '../../lib/types';

export const logoutFunction = createServerFn({ method: 'POST' }).handler(
    async (): Promise<GenericServerError | undefined> => {
        const supabase = await getSupabaseServerClient();
        const { error } = await supabase.auth.signOut({ scope: 'local' });

        if (error) {
            return {
                error: true,
                message: error.message,
            };
        }

        throw redirect({
            href: '/',
        });
    }
);
