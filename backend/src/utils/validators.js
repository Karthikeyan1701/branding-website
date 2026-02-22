import mongoose from "mongoose";

// Object ID Validator

export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Required field validator

export const requiredInputFields = (fields, body) => {
    return fields.filter((field) => {
        const value = body[field];

        return (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        );
    });
};