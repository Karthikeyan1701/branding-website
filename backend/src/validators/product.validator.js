import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive('Price must be greater than 0'),
  categoryId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid category ID',
  }),
  subcategoryId: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Invalid subcategory ID',
    }),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .optional(),

    description: z.string().optional(),

    price: z
      .number({
        invalid_type_error: "Price must be a number"
      })
      .positive("Price must be greater than 0")
      .optional(),

    categoryId: z
      .string()
      .refine(
        (val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: "Invalid category ID"
        }
      )
      .optional(),

    subcategoryId: z
      .string()
      .refine(
        (val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: "Invalid subcategory ID"
        }
      )
      .optional(),
});
