require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Resort Inn API',
    description: 'API documentation for Resort Inn'
  },
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],

  securityDefinitions: {
    oauth2: {
      type: 'oauth2',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      flow: 'implicit',
      scopes: {
        read: 'Grants read access',
        write: 'Grants write access'
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/clientRoutes.js'];

swaggerAutogen(outputFile, endpointFiles, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully.');
  })
  .catch((err) => {
    console.error('Error generating Swagger documentation:', err);
  });