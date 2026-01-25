import express from 'express';
import {
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  getCurrentAdmin,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Admin login
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, password]
 *            properties:
 *              email:
 *                type: string
 *                example: admin@example.com
 *              password:
 *                type: string
 *                example: Admin@123
 *    response:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Invalid credentials
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedError'
 */

router.post('/login', authRateLimiter, validate(loginSchema), loginAdmin);

/**
 * @swagger
 * /api/auth/refresh:
 *    post:
 *      summary: Refresh access token
 *      tags: [Auth]
 *      responses:
 *        200:
 *          description: Token refreshed
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *        401:
 *          description: Invalid or expired refresh token
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

router.post('/refresh', refreshAccessToken);

/**
 * @swagger
 * /api/auth/logout:
 *    post:
 *      summary: Logout admin
 *      tags: [Auth]
 *      security:
 *        - BearerAuth: []
 *      responses:
 *        200:
 *          description: Logout successful
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *        401:
 *          description: Not authorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

router.post('/logout', logoutAdmin);

/**
 * @swagger
 * /api/auth/me:
 *    get:
 *      summary: Get current admin profile
 *      tags: [Auth]
 *      security:
 *        - BearerAuth: []
 *      responses:
 *        200:
 *          description: Admin profile retrieved
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *        401:
 *          description: Not authorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

router.get('/me', protect, getCurrentAdmin);

export default router;
