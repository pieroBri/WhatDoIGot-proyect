const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API What do i got',
        description: 'Documentación de la API para el proyecto What do i got',
    },
    host: 'localhost:3000',
    schemes: ['http']
}

const outputFile = './swagger_output.json';
const endpointsFiles = ['../server/routes/RoomRoutes.js']; // Cambia este archivo según el punto de entrada de tu API

swaggerAutogen(outputFile, endpointsFiles, doc);