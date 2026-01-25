import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { paginationSchema } from '../validators/query.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *    get:
 *      summary: Get all categories
 *      tags: [Categories]
 *      responses:
 *        200:
 *          description: Categories retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 */

router.get('/', validate(paginationSchema, 'query'), getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *    get:
 *      summary: Get category by ID
 *      tags: [Categories]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Category retrieved successfully by ID
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *        404:
 *          description: Category not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/:id', validate(objectIdSchema, 'params'), getCategoryById);

/**
 * @swagger
 * /api/categories:
 *    post:
 *      summary: Create a new category
 *      tags: [Categories]
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [name]
 *              properties:
 *                name:
 *                  type: string
 *                  example: Design
 *      responses:
 *        201:
 *          description: Category created successfully
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

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createCategorySchema),
  createCategory,
);

/**
 * @swagger
 * /api/categories/{id}:
 *    put:
 *      summary: Update a category
 *      tags: [Categories]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Updated Design
 *      responses:
 *        200:
 *          description: Category updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 */

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  validate(updateCategorySchema),
  updateCategory,
);

/**
 * @swagger
 * /api/categories/{id}:
 *    delete:
 *      summary: Delete a category
 *      tags: [Categories]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Category deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 */

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  deleteCategory,
);

export default router;
