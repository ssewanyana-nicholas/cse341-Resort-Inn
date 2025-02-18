// const router = require('express').Router();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../swagger.json');
// router.use('/api-docs', swaggerUi.serve);
// router.use('/api-docs', swaggerUi.setup(swaggerDocument));

// module.exports = router;

// routes/swagger.js

const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
require('dotenv').config();

const swaggerUiOptions = {
  oauth2RedirectUrl: `${process.env.BASE_URL}/api-docs/oauth2-redirect.html`, 
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    appName: "Resort Inn API",
    usePkceWithAuthorizationCodeGrant: false,
    additionalQueryStringParams: {
      state: Buffer.from('/api-docs').toString('base64')
    }
  },
  persistAuthorization: true,

  // Add a custom script to parse `?access_token=...` and preauthorize
  swaggerOptions: {
    // This function is called after Swagger UI is fully set up.
    onComplete: () => {
      // You can reference `window.ui` - the global Swagger UI instance.
      const url = new URL(window.location.href);
      const token = url.searchParams.get('access_token');
      if (token) {
        // 'oauth2' must match the "security name" in your swagger.json
        // e.g., securityDefinitions: { oauth2: { ... } }
        window.ui.preauthorize('oauth2', token)
          .then(() => {
            console.log('Successfully preauthorized with token:', token);
          })
          .catch((err) => {
            console.error('Error preauthorizing token:', err);
          });
      }
    }
  }
};

// Serve the UI
router.use('/api-docs', swaggerUi.serve);
router.use('/api-docs', swaggerUi.setup(swaggerDocument, swaggerUiOptions));

module.exports = router;