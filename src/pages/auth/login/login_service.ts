import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../../lib/supabase';
import { GenericServerError } from '../../../lib/types';

export const loginFunction = createServerFn({ method: 'POST' })
    .validator(
        (d: { email: string; password: string; redirectUrl?: string }) => d
    )
    .handler(async ({ data }): Promise<GenericServerError | undefined> => {
        const supabase = await getSupabaseServerClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            return {
                error: true,
                message: error.message,
            };
        }

        throw redirect({
            href: data.redirectUrl || '/',
        });
    });
