const status = require('./status');

// Properties to remove from an Axios error.
const PROPS_TO_REMOVE = [
  'config',
  'code',
  'request',
  'response',
  'isAxiosError',
  'toJSON',
];

// For removing certain values from an Axios error.
const stripAxiosError = (err) => {
  // Remove the enhanced Error values.
  PROPS_TO_REMOVE.forEach((value) => delete err[value]);
  return err;
};

/**
 * Error class for Axios request errors.
 *
 * @class RequestError
 * @extends {Error}
 */
class RequestError extends Error {
  /**
   * Creates an instance of RequestError.
   *
   * @param {Error} cause Error object.
   * @memberof RequestError
   */
  constructor(cause) {
    super();
    // Set the custom error values.
    this.name = 'RequestError';
    this.message = String(cause);
    this.cause = stripAxiosError(cause);
    // Add the stack trace.
    Error.captureStackTrace(this, RequestError);
  }
}

/**
 * Error class for Axios status code (response) errors.
 *
 * @class StatusCodeError
 * @extends {Error}
 */
class StatusCodeError extends Error {
  /**
   * Creates an instance of StatusCodeError.
   *
   * @param {Error} cause Error object.
   * @memberof StatusCodeError
   */
  constructor(cause) {
    super();
    // Set the custom error values.
    this.name = 'StatusCodeError';
    this.message = String(cause);
    this.statusCode = cause.response.status;
    this.statusMessage = cause.response.statusText ||
      status[`${this.statusCode}`];
    this.headers = cause.response.headers;
    this.body = cause.response.data;
    this.cause = stripAxiosError(cause);
    // Add the stack trace.
    Error.captureStackTrace(this, StatusCodeError);
  }
}

/**
 * Determines if an error is an 'axios' request error.
 *
 * @param {Error} err The 'axios' Error.
 * @returns {Boolean} Request error or not.
 */
function isAxiosRequestError(err) {
  return err && err.config && err.response === undefined;
}

/**
 * Determines if an error is an 'axios' response error.
 *
 * @param {Error} err The 'axios' Error.
 * @returns {Boolean} Response error or not.
 */
function isAxiosResponseError(err) {
  return err && err.response && err.response.status !== undefined;
}

module.exports = {
  RequestError,
  StatusCodeError,
  isAxiosRequestError,
  isAxiosResponseError,
};
