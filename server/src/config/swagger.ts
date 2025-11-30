import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'DarShana Travel API',
      version: '1.0.0',
      description: 'REST APIs powering the India-only DarShana Travel experience'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local dev' }
    ]
  },
  apis: ['src/routes/*.ts', 'src/models/*.ts']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
