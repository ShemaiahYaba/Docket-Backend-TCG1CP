import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import settings from './settings.js';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Docket API",
      version: "1.0.0",
      description:
        "REST API for Docket — a Legal Case Management Platform for Nigerian law firms. " +
        "Manage lawyers, clients, cases, and court hearings.",
      contact: {
        name: "Docket Backend Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${settings.port}/api`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token. Obtain it from POST /api/auth/login.",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scan all route files for @swagger JSDoc annotations
  apis: ["./src/routes/*.js", "./docs/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
