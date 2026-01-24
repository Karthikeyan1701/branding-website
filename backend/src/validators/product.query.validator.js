import { z } from "zod";

export const productQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) > 0, {
            message: "Page must be a positive number",
        }),

    limit: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) > 0, {
            message: "Limit must be a positive number",
        }),

    sort: z.string().optional(),

    minPrice: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) > 0, {
            message: "minPrice must be >= 0",
        }),

    maxPrice: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) > 0, {
            message: "maxPrice must be >= 0",
        }),
    
    categoryId: z
        .string()
        .optional()
        .refine((v) => !v || /^[0-9a-fA-F]{24}$/.test(v), {
            message: "Invalid category ID",
        }),
});