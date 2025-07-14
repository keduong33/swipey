import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../integrations/supabase/serverClient';

export const loginFunction = createServerFn({ method: 'POST' })
    .validator(
        (d: { email: string; password: string; redirectUrl?: string }) => d
    )
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            console.log('SignInWithPassword:', error);
            throw new Error('Cannot login');
        }

        throw redirect({
            href: data.redirectUrl || '/',
        });
    });
