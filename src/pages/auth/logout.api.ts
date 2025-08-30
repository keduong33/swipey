import { redirect } from '@tanstack/react-router';
import { supabaseClient } from '../../integrations/supabase/browserClient';

export async function logout() {
    const { error } = await supabaseClient.auth.signOut({ scope: 'local' });

    if (error) {
        throw error;
    }

    throw redirect({ to: '/' });
}
