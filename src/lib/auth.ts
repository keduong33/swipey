import { Session } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import { getBrowserClient } from '../integrations/supabase/browserClient';
import { Database } from '../integrations/supabase/database.types';
import { JwtClaims } from '../pages/auth/auth.queries';

export type User =
    | {
          isAuthenticated: true;
          plan: Database['public']['Enums']['UserPlan'];
      }
    | { isAuthenticated: false };

function getUserFromSession(session: Session) {
    const jwt = jwtDecode<JwtClaims>(session.access_token);

    const user: User = {
        isAuthenticated: true,
        plan: jwt.plan,
    };

    return user;
}

export async function getUser(): Promise<User> {
    const supabase = getBrowserClient();

    const { data, error } = await supabase.auth.getSession();

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
