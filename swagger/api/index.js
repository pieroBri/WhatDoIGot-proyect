// api/index.js - Vercel Serverless Function
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocumentation = require("../swagger_output.json");

const app = express();

// Swagger UI setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

// Export for Vercel Serverless Functions
module.exports = app;
