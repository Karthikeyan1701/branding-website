export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const err = new Error('Forbidden');
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
};