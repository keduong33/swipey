import { z } from 'zod';

// These are for JSON parsing (MVP)

// Zod schema for Item (adjust types if needed)
const ItemSchema = z.object({
    id: z.number(), // allow string or number id
    name: z.string(),
    image: z.string().nullable(),
});

// Zod schema for List should be consistent with List type
export const ListSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    // visibility: z.string(), // uncomment & adjust if you add this
    category: z.string().optional(),
    items: z.array(ItemSchema),
    // lastPlayed: z.string().optional(),
    // status: z.string().optional(),
});
