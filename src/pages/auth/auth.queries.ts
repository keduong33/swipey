import { queryOptions } from '@tanstack/react-query';
import { getBrowserClient } from '../../integrations/supabase/browserClient';
import { Database } from '../../integrations/supabase/database.types';

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
      }
    | { isAuthenticated: false };

export const userQueryOptions = () => {
    const supabase = getBrowserClient();
    return queryOptions({
        queryKey: ['user'],
        queryFn: () => supabase.auth.getSession(),
        staleTime: 300000, // 5 minutes
    });
};
