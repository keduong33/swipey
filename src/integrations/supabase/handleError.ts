import { PostgrestError } from '@supabase/supabase-js';

export function handlePostgresError(error: PostgrestError): string {
    switch (error.code) {
        case '23505': // unique_violation
            return 'That already exists.';
        case '23503': // foreign_key_violation
            return 'Referenced item does not exist.';
        case '23502': // not_null_violation
            return 'Missing required field.';
        case '42501': // insufficient_privilege (RLS / permission denied)
            return 'You do not have permission to perform this action.';
        case '23514': // check_violation
            return 'Input failed a validation check.';
        default:
            return 'Unexpected error. Please try again.';
    }
}
