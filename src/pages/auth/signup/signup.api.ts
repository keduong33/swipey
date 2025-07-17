import { redirect } from '@tanstack/react-router';
import { supabaseClient } from '../../../integrations/supabase/browserClient';

export async function signUp({
    email,
    password,
    redirectUrl,
}: {
    email: string;
    password: string;
    redirectUrl?: string;
}) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    throw redirect({
        to: redirectUrl ?? '/',
    });
}
