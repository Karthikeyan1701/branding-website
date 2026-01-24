import { z } from 'zod';

export const createSubcategorySchema = z.object({
  name: z.string().min(2, 'Subcategory name must be at least 2 characters'),
  category: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid category ID',
  }),
});

export const updateSubcategorySchema = z.object({
  name: z
    .string()
    .min(2, "Subcategory name must be at least 2 characters")
    .optional(),

  categoryId: z
    .string()
    .refine(
      (val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid category ID"
      }
    )
    .optional(),
});
