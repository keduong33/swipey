import { createServerClient } from '@supabase/ssr';
import { parseCookies, setCookie } from '@tanstack/react-start/server';
import { Database } from './database.types';

export function getSupabaseServerClient() {
    return createServerClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.entries(parseCookies()).map(
                        ([name, value]) => ({
                            name,
                            value,
                        })
                    );
                },
                setAll(cookies) {
                    cookies.forEach((cookie) => {
                        setCookie(cookie.name, cookie.value);
                    });
                },
            },
        }
    );
}
