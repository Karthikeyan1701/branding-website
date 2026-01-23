export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            const err = new Error('Forbidden');
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
};