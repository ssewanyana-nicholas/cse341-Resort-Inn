const Joi = require('joi');

const joiValidation = (schema) => {
  return async (req, res, next) => {
    try {  
      const value = await schema.validateAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};

module.exports = { joiValidation };
;
