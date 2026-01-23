import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

// Protect routes

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorized, token missing');
    err.statusCode = 401;
    return next(err);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      const err = new Error('Not authorized');
      err.statusCode = 401;
      return next(err);
    }

    req.admin = admin;
    next();
  } catch (error) {
    const err = new Error('Not authorized, token invalid');
    err.statusCode = 401;
    next(err);
  }
};
