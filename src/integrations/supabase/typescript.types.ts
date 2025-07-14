import { Database } from './database.types';

export type UserPlan = Database['public']['Enums']['UserPlan'];

// Item
export type ItemInsert = Database['public']['Tables']['Item']['Insert'];
export type ItemUpdate = Database['public']['Tables']['Item']['Update'];
