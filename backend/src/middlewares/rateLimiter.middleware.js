import rateLimit from "express-rate-limit";

// Auth routes limiter
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too much login attempts. Please try again later."
    }
});

// General API Limiter (relaxed)

export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});