import { ZodError } from "zod";

export const validate = (schema, property = "body") => (req, res, next) => {
    try {
        schema.parse(req[property]);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
        }
        next(error);
    }
};