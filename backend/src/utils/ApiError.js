export class apiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        isOperational = true
    ) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}