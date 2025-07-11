import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../integrations/supabase/serverClient';
import { GenericServerResponse } from '../../lib/types';

export const logoutFunction = createServerFn({ method: 'POST' }).handler(
    async (): Promise<GenericServerResponse> => {
        const supabase = await getSupabaseServerClient();
        const { error } = await supabase.auth.signOut({ scope: 'local' });

        if (error) {
            return {
                error: true,
                message: error.message,
            };
        }

        return {
            error: false,
        };
    }
);
