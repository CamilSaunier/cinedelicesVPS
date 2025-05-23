import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

// Permet d'utiliser __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiUrl = `${process.env.BASE_URL}:${process.env.PORT}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cines Délices API",
      version: "1.0.0",
      description: "Documentation Swagger de l'API Ciné Délices",
    },
    servers: [
      {
        url: apiUrl,
      },
    ],
  },
  apis: [path.join(__dirname, "../../src/router.js"), path.join(__dirname, "../swagger/**/*.swagger.js")], // Chemin vers tes routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
