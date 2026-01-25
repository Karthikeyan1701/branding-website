import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subcategory.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createSubcategorySchema, updateSubcategorySchema } from '../validators/subcategory.validator.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { z } from "zod";

const router = express.Router();

/**
 * @swagger
 * /api/subcategories:
 *    get:
 *      summary: Get all subcategories
 *      tags: [Subcategories]
 *      responses:
 *        200:
 *          description: Subcategories retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 */

router.get('/', getAllSubCategories);

/**
 * @swagger
 * /api/subcategories/category/{categoryId}:
 *    get:
 *      summary: Get subcategories by category ID
 *      tags: [Subcategories]
 *      parameters:
 *        - in: path
 *          name: categoryId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Subcategories retrieved successfully
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

router.get(
  '/category/:categoryId',
  validate(z.object({
    categoryId: objectIdSchema.shape.id,
  }), 'params'),
  getSubCategoriesByCategory,
);

/**
 * @swagger
 * /api/subcategories:
 *    post:
 *      summary: Create a new subcategory
 *      tags: [Subcategories]
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [name, category]
 *              properties:
 *                name:
 *                  type: string
 *                  example: Logo Design
 *                category:
 *                  type: string
 *                  example: 64c2f9b0e2a4a9b9f3a12345
 *      responses:
 *        201:
 *          description: Subcategory created successfully
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
  validate(createSubcategorySchema),
  createSubCategory,
);

/**
 * @swagger
 * /api/subcategories/{id}:
 *    put:
 *      summary: Update a subcategory
 *      tags: [Subcategories]
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
 *                  example: Updated Logo Design
 *                category:
 *                  type: string
 *                  example: 64c2f9b0e2a4a9b9f3a12345
 *      responses:
 *        200:
 *          description: Subcategory updated successfully
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
  validate(updateSubcategorySchema),
  updateSubCategory,
);

/**
 * @swagger
 * /api/subcategories/{id}:
 *    delete:
 *      summary: Delete a subcategory
 *      tags: [Subcategories]
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
 *          description: Subcategory deleted successfully
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
  deleteSubCategory,
);

export default router;
