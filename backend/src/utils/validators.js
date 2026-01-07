import mongoose from "mongoose";

// Object ID Validator

export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Required field validator

export const requiredInputFields = (fields, body) => {
    const missingFields = fields.filter((f) => !body[f]);
    return missingFields;
};