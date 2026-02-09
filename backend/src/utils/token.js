import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';

export const generateAccessToken = (payload) => {
    return jwt.sign(
        { ...payload, type: 'access' },
        process.env.JWT_SECRET, 
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(
        { ...payload, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: "7d" }
    );
};

export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'access') {
            throw new apiError(401, 'Invalid access token');
        }

        return decoded;
    } catch {
        throw new apiError(401, 'Access token expired or invalid');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        if (decoded.type !== 'refresh') {
            throw new apiError(401, 'Invalid refresh token');
        }

        return decoded;
    } catch {
        throw new apiError(401, 'Refresh token expired or invalid');
    }
};