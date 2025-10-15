import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Podcast API',
      version: '1.0.0',
      description: 'A RESTful API for podcast management with authentication',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Podcast: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Podcast ID',
            },
            title: {
              type: 'string',
              description: 'Podcast title',
            },
            description: {
              type: 'string',
              description: 'Podcast description',
            },
            author: {
              type: 'string',
              description: 'Podcast author',
            },
            category: {
              type: 'string',
              description: 'Podcast category',
            },
            imageUrl: {
              type: 'string',
              description: 'URL to podcast image',
            },
            audioUrl: {
              type: 'string',
              description: 'URL to podcast audio file',
            },
            duration: {
              type: 'number',
              description: 'Duration in seconds',
            },
            fileSize: {
              type: 'number',
              description: 'File size in bytes',
            },
            uploadedBy: {
              type: 'string',
              description: 'ID of user who uploaded',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Podcasts',
        description: 'Podcast management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger page
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Podcast API Documentation',
    })
  );

  // Swagger JSON
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /swagger');
};
