import { createServerFn } from '@tanstack/react-start';
import { getSupabaseServerClient } from '../../integrations/supabase/serverClient';
import { User } from '../../lib/auth';

export const getUser = createServerFn({ method: 'GET' }).handler(
    async (): Promise<User> => {
        const supabase = getSupabaseServerClient();
        const {
            data: { user },
            error: _error,
        } = await supabase.auth.getUser();

        if (_error || !user) {
            return {
                isAuthenticated: false,
            };
        }

        return {
            isAuthenticated: true,
            id: user.id,
            plan: user.app_metadata.plan,
        };
    }
);

export function getAccessToken(headers: Headers) {
    const authHeader = headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Missing or malformed Authorization header');
    }

    return authHeader.split(' ')[1];
}
