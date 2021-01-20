const Joi = require('joi');
const has = require('lodash.has');

const TIMEOUT_MIN = 60;
const TIMEOUT_MAX = 2592000;

// UUID validation.
const uuidSchema = Joi.string().uuid().empty().required().messages({
  'string.base': `The 'uuid' must be a string`,
  'string.empty': `The 'uuid' cannot be empty`,
  'string.guid': `The 'uuid' must be a valid UUID string`,
  'any.required': `The 'uuid' is a required value`,
});

// Unique key (SHA1) validation.
const uniqueKeySchema = Joi.string().pattern(/^[a-f0-9]{40}$/i).empty();

// UUID or Unique key validation.
const uuidOrUniqueKeySchema = Joi.alternatives()
  .try(Joi.string().uuid().empty(), uniqueKeySchema).required()
  .messages({
    'alternatives.match': `The 'uuid' must be a valid UUID or ` +
      'unique key (SHA1) string',
  });

// Tags validation.
const tagsSchema = Joi.array().items(Joi.string().messages({
  'string.base': `The 'tags' must be an array of strings`,
})).allow(null).optional().messages({
  'array.base': `The 'tags' must be an array of strings`,
});

// Flips (status changes) query parameter validation.
const flipsQuerySchema = Joi.object().keys({
  seconds: Joi.number().integer().optional().messages({
    'number.base': `The 'seconds' value must be an integer`,
    'number.integer': `The 'seconds' value must be an integer`,
  }),
  start: Joi.number().integer().optional().messages({
    'number.base': `The 'start' value must be an integer`,
    'number.integer': `The 'start' value must be an integer`,
  }),
  end: Joi.number().integer().optional().messages({
    'number.base': `The 'end' value must be an integer`,
    'number.integer': `The 'end' value must be an integer`,
  }),
}).prefs({ abortEarly: false });

// Health check validation.
const checkSchema = Joi.object().keys({
  name: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'name' value must be a string`,
  }),
  tags: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'tags' value must be a string`,
  }),
  desc: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'desc' value must be a string`,
  }),
  timeout: Joi.number().integer().min(TIMEOUT_MIN).max(TIMEOUT_MAX)
    .allow(null).optional()
    .messages({
      'number.base': `The 'timeout' value must be an integer between ` +
        `${TIMEOUT_MIN} and ${TIMEOUT_MAX}`,
      'number.integer': `The 'timeout' value must be an integer between ` +
        `${TIMEOUT_MIN} and ${TIMEOUT_MAX}`,
      'number.min': `The 'timeout' value must be larger than or equal to {#limit}`,
      'number.max': `The 'timeout' value must be smaller than or equal to {#limit}`,
    }),
  grace: Joi.number().integer().min(TIMEOUT_MIN).max(TIMEOUT_MAX)
    .allow(null).optional()
    .messages({
      'number.base': `The 'grace' value must be an integer between ` +
        `${TIMEOUT_MIN} and ${TIMEOUT_MAX}`,
      'number.integer': `The 'grace' value must be an integer between ` +
        `${TIMEOUT_MIN} and ${TIMEOUT_MAX}`,
      'number.min': `The 'grace' value must be larger than or equal to {#limit}`,
      'number.max': `The 'grace' value must be smaller than or equal to {#limit}`,
    }),
  schedule: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'schedule' value must be a string`,
  }),
  tz: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'tz' value must be a string`,
  }),
  channels: Joi.string().allow('', null).optional().messages({
    'string.base': `The 'channels' value must be a string`,
  }),
  unique: Joi.array().items(Joi.string().empty()
    .valid('name', 'tags', 'timeout', 'grace')
    .messages({
      'any.only': `A 'unique' item must be a string that equals either 'name', ` +
        `'tags', 'timeout', or 'grace'`,
    }),
  ).allow(null).optional().messages({
    'array.base': `The 'unique' value must be an array of strings`,
  }).prefs({ abortEarly: true }),
}).prefs({ abortEarly: false });

/**
 * Gets all of the error messages from a schema validation.
 *
 * @param {Object} error
 * @returns {String} Combined error message string.
 */
function getValidationErrorMsgs(error) {
  return error.details.map((e) => e.message).join('.');
}

/**
 * Performs validation on a value using the provided Joi schema.
 *
 * @param {String|Object|Array} value The value to validate.
 * @param {Object} schema Joi schema.
 * @returns {Object} Validation results.
 */
function performValidation(value, schema) {
  // Execute the validation.
  const result = schema.validate(value);

  if (has(result, 'error')) {
    // Return the error messages.
    return {
      valid: false,
      errors: getValidationErrorMsgs(result.error),
    };
  }

  return { valid: true };
}

module.exports = {
  uuidSchema,
  uuidOrUniqueKeySchema,
  tagsSchema,
  flipsQuerySchema,
  checkSchema,
  performValidation,
};
