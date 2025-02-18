const { format } = require('util');
const { JoiValidationError } = require('joi');

// Create an error handling middleware
function handleValidationErrors(err, req, res, next) {
  if (err instanceof JoiValidationError) {
    const { details } = err;
    const errorDetails = details.map(
      (detail) => `${format(detail.message)} - ${detail.path}`
    );
    const errorMessage = `Validation failed: ${errorDetails.join(', ')}.`;

    return res.status(400).json({
      status: 400,
      message: errorMessage,
      errors: details,
    });
  }

  // If the error is not a JoiValidationError, pass it to the next error handler
  return next(err);
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 400,
      message: 'Validation Error',
      details: err.details.map(detail => detail.message)
    });
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = {
    handleValidationErrors, errorHandler
}