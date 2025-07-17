import { isAuthWeakPasswordError } from '@supabase/supabase-js';
import { redirect } from '@tanstack/react-router';
import { supabaseClient } from '../../integrations/supabase/browserClient';
import { SignupMessages } from './signup/signup.messages';

export async function login({
    email,
    password,
    redirectUrl,
}: {
    email: string;
    password: string;
    redirectUrl?: string;
}) {
    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        let message = error.message;
        if (isAuthWeakPasswordError(error)) {
            message = SignupMessages.WeakPassword();
        }

        console.error(error);

        throw new Error(message);
    }

    throw redirect({ to: redirectUrl ?? '/' });
}
