import { z } from 'zod';

// Re-export z for use in other files
export { z };

// Common schemas
export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const ModeSchema = z.enum(['test', 'live']).default('test');