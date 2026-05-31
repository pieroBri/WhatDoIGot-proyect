// app.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDocumentation = require("./swagger_output.json");

const app = express();
const port = 3000;


// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "WhatDoIGot API",
      version: "0.0.1",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["../server/routes/*js"], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


module.expors = app;