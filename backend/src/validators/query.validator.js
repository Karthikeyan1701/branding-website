import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) > 0, {
      message: 'Page must be a positive number',
    }),
    
  limit: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) > 0, {
      message: 'Limit must be a positive number',
    }),
});
