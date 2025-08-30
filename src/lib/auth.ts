import { Session } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

import { createMiddleware } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { supabaseClient } from '../integrations/supabase/browserClient';
import { Database } from '../integrations/supabase/database.types';
import { getSupabaseServerClient } from '../integrations/supabase/serverClient';
import { getAccessToken } from '../pages/auth/auth.api';

export type AccessToken = {
    // default
    iss: string;
    aud: string | string[];
    exp: number;
    iat: number;
    sub: string;
    role: string;
    aal: 'aal1' | 'aal2';
    session_id: string;
    email: string;
    phone: string;
    is_anonymous: boolean;
    jti?: string;
    nbf?: number;
    app_metadata?: Record<string, any>;
    user_metadata?: {};
    amr?: Array<{
        method: string;
        timestamp: number;
    }>;
    ref?: string; // Only in anon/service role tokens
    // custom
    plan: Database['public']['Enums']['UserPlan'];
};

export function getUserFromSession(session: Session): User {
    return {
        isAuthenticated: true,
        accessToken: getAccessTokenFromSession(session),
    };
}

export function getAccessTokenFromSession(session: Session) {
    return jwtDecode<AccessToken>(session.access_token);
}

export type User =
    | {
          isAuthenticated: true;
          accessToken: AccessToken;
      }
    | {
          isAuthenticated: false;
      }
    | null;

export async function getUser(): Promise<User> {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
    }

    if (!data.session) {
        return {
            isAuthenticated: false,
        };
    }

    return getUserFromSession(data.session);
}

export const authMiddleware = createMiddleware({ type: 'function' }).client(
    async ({ next }) => {
        const accessToken = (await supabaseClient.auth.getSession()).data
            .session?.access_token;

        if (!accessToken) {
            return next();
        }

        return next({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
);

export const verifyAuthMiddleWare = createMiddleware({
    type: 'function',
}).server(async ({ next }) => {
    const accessToken = getAccessToken(getWebRequest().headers);
    const supabase = getSupabaseServerClient();

    const { data, error: authError } =
        await supabase.auth.getClaims(accessToken);

    if (authError || !data) {
        console.error('authError', authError);
        throw new Response('You must login', { status: 401 });
    }

    return next({
        context: {
            claims: data.claims as AccessToken,
        },
    });
});
