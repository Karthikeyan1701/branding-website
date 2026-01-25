import { logger } from "./logger.js";

export const validatorEnv = () => {
    const required = ["PORT", "MONGO_URI", "JWT_SECRET"];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        logger.error({ missing }, "Missing required environment variables:");
        process.exit(1);
    }
};