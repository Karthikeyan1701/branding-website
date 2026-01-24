import { z } from 'zod';

export const objectIdSchema = z.object({
  id: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Invalid ID format',
    }),
});
