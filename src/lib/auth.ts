import { Session } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

import { createMiddleware } from '@tanstack/react-start';
import { supabaseClient } from '../integrations/supabase/browserClient';
import { Database } from '../integrations/supabase/database.types';

export interface JwtClaims {
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
}

export type User =
    | {
          isAuthenticated: true;
          plan: Database['public']['Enums']['UserPlan'];
          id: string;
      }
    | { isAuthenticated: false };

function getUserFromSession(session: Session) {
    const jwt = jwtDecode<JwtClaims>(session.access_token);

    const user: User = {
        isAuthenticated: true,
        plan: jwt.plan,
        id: session.user.id,
    };

    return user;
}

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
