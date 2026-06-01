// api/index.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocumentation = require("../swagger_output.json");

const app = express();

// Swagger UI setup - sirve en la raíz
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

module.exports = app;