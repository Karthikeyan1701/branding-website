import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

// Allow explicit override, otherwise env-based default
const level = 
    process.env.LOG_LEVEL ||
    (isProd ? "warn" : "info");

export const logger = pino({
    level,
    transport: isProd
        ? undefined
        : {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname",
            },
          },
});