import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { supabaseClient } from '../integrations/supabase/browserClient';
import { User } from '../lib/auth';

const AuthProviderContext = createContext<User>({ isAuthenticated: false });

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({ isAuthenticated: false });

    // supabaseClient.auth.getSession().then((session)=>{

    // })

    console.log('me run?');

    useEffect(() => {
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((event, session) => {
            /**
             * Useful doc for this subscription https://supabase.com/docs/reference/javascript/auth-onauthstatechange
             */
            console.log('Event:', event);
            console.log('Session: ', session);

            if (event === 'INITIAL_SESSION') {
                // if (session) {
                //     setUser(getUserFromSession(session));
                // }
            } else if (event === 'SIGNED_IN') {
                // handle sign-in
            } else if (event === 'SIGNED_OUT') {
                // handle sign-out
            } else if (event === 'TOKEN_REFRESHED') {
                // update session claims maybe
            } else if (event === 'USER_UPDATED') {
                // update user data
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthProviderContext.Provider value={user}>
            {children}
        </AuthProviderContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthProviderContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
