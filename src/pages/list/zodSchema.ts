import { z } from 'zod';

// These are for JSON parsing (MVP)

// Zod schema for Item (adjust types if needed)
const ItemSchema = z.object({
    id: z.string(), // allow string or number id
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

export const ResultSchema = z.object({
    id: z.string(),
    listId: z.string(),
    name: z.string(),
    comparisons: z.number(),
    currentArray: z.array(ItemSchema),
});

export const ListsSchema = z.array(ListSchema);
export const ResultsSchema = z.array(ResultSchema);
