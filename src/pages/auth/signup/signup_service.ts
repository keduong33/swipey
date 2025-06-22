import { isAuthWeakPasswordError } from '@supabase/supabase-js';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../../lib/supabase';
import { GenericServerError } from '../../../lib/types';
import { SignupMessages } from './signup.messages';

export const signupFunction = createServerFn({ method: 'POST' })
    .validator(
        (d: { email: string; password: string; redirectUrl?: string }) => d
    )
    .handler(async ({ data }): Promise<GenericServerError | undefined> => {
        const supabase = await getSupabaseServerClient();
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (error) {
            let message = error.message;
            if (isAuthWeakPasswordError(error)) {
                message = SignupMessages.WeakPassword();
            }

            return {
                error: true,
                message,
            };
        }

        // Redirect to the prev page stored in the "redirect" search param
        throw redirect({
            href: data.redirectUrl || '/',
        });
    });
