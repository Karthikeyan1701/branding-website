import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Branding Website Backend API',
      version: '1.0.0',
      description:
        'REST API for the Branding Website backend, which includes authentication and CRUD operations in categories, subcategories, and products.',
      contact: {
        name: 'Backend Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT Authorization header using the Bearer scheme. Example: `Authorization: Bearer <token>`',
        },
      },

      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              example: {},
            },
          },
          required: ['success'],
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Something went wrong',
            },
            stack: {
              type: 'string',
              example: 'Error stack trace (dev only',
            },
          },
          required: ['success', 'message'],
        },

        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email format',
                  },
                },
              },
            },
          },
          required: ['success', 'message'],
        },

        UnauthorizedError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Not authorized',
            },
          },
          required: ['success', 'message'],
        },

        ForbiddenError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Access denied',
            },
          },
          required: ['success', 'message'],
        },
      },

      responses: {
        BadRequest: {
          description: 'Bad request / Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },

        Unauthorized: {
          description: 'Unauthorized - missing or invalid token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError',
              },
            },
          },
        },

        Forbidden: {
          description: 'Forbidden - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenError',
              },
            },
          },
        },

        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        TooManyRequests: {
          description: 'Too many requests - rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },

    // Apply auth globally (can be overridden per route)
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
