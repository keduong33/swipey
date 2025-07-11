import { isAuthWeakPasswordError } from '@supabase/supabase-js';
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../../integrations/supabase/serverClient';
import { GenericServerResponse } from '../../../lib/types';
import { SignupMessages } from './signup.messages';

export const signupFunction = createServerFn({ method: 'POST' })
    .validator((d: { email: string; password: string }) => d)
    .handler(async ({ data }): Promise<GenericServerResponse> => {
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

        return {
            error: false,
        };
    });
