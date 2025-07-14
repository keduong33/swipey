import { isAuthWeakPasswordError } from '@supabase/supabase-js';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../../integrations/supabase/serverClient';
import { SignupMessages } from './signup.messages';

export const signupFunction = createServerFn({ method: 'POST' })
    .validator(
        (d: { email: string; password: string; redirectUrl?: string }) => d
    )
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient();
        const { error } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
        });

        if (error) {
            let message = error.message;
            if (isAuthWeakPasswordError(error)) {
                message = SignupMessages.WeakPassword();
            }

            console.error(error);

            throw new Error(message);
        }

        // Gotta make them login again for now
        throw redirect({
            href: '/login',
            search: {
                redirectUrl: data.redirectUrl ?? '/',
            },
        });
    });
