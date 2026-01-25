import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  updateProduct,
  deleteProduct,
  redirectToExternalUrl,
} from './../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { productQuerySchema } from '../validators/product.query.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *    get:
 *      summary: Get all products
 *      tags: [Products]
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: Page number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: Items per page
 *        - in: query
 *          name: sort
 *          schema:
 *            type: string
 *            description: Sort field
 *      responses:
 *        200:
 *          description: Products retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 */

router.get('/', validate(productQuerySchema, 'query'), getAllProducts);

/**
 * @swagger
 * /api/products/subcategory/{subcategoryId}:
 *    get:
 *      summary: Get products by subcategory ID
 *      tags: [Products]
 *      parameters:
 *        - in: path
 *          name: subcategoryId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Products retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *        404:
 *          description: Subcategory not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  '/subcategory/:subcategoryId',
  validate(objectIdSchema, 'params'),
  getProductsBySubCategory,
);

/**
 * @swagger
 * /api/products/redirect/{id}:
 *    get:
 *      summary: Redirect to product URL
 *      tags: [Products]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        302:
 *          description: Redirect to product URL
 *        404:
 *          description: Product not found
 *          content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/redirect/:id', redirectToExternalUrl);

/**
 * @swagger
 * /api/products:
 *    post:
 *      summary: Create a new product
 *      tags: [Products]
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [name, subcategory, price]
 *              properties:
 *                name:
 *                  type: string
 *                  example: Business Card Design
 *                subcategory:
 *                  type: string
 *                  example: 64c2f9b0e2a4a9b9f3a12345
 *                price:
 *                  type: number
 *                  example: 199.99
 *      responses:
 *        201:
 *          description: Product created successfully
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
  validate(createProductSchema),
  createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *      summary: Update a product
 *      tags: [Products]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  price:
 *                    type: number
 *      responses:
 *          200:
 *            description: Product updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/SuccessResponse'
 */

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  validate(updateProductSchema),
  updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *      summary: Delete a product
 *      tags: [Products]
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
 *          description: Product deleted successfully
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
  deleteProduct,
);

export default router;
