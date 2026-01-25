import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;

        logger.info({
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2)),
        },
        "HTTP request"
      );
    });

    next();
};