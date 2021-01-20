const axios = require('axios');
const qs = require('qs');
const has = require('lodash.has');
const isPlainObject = require('lodash.isplainobject');
const isEmpty = require('lodash.isempty');
const status = require('./utils/status');
const { version } = require('../package.json');

// Import the error utils.
const {
  RequestError,
  StatusCodeError,
  isAxiosRequestError,
  isAxiosResponseError
} = require('./utils/errors');
// Validation utils.
const {
  uuidSchema,
  uuidOrUniqueKeySchema,
  tagsSchema,
  flipsQuerySchema,
  checkSchema,
  performValidation
} = require('./utils/validation');

// Base URL for Healthchecks.io.
const BASE_URL = 'https://healthchecks.io';
// Client user agent string.
const USER_AGENT = `HealthChecks-IO-Client-JS/${version}`;
// Default API version.
const API_VERSION = 1;

/**
 * A library for interacting with the Healthchecks.io Management
 * REST API for listing, creating, updating, pausing and deleting
 * health checks.
 *
 * @class HealthChecksApiClient
 */
class HealthChecksApiClient {
  /**
   * Creates an instance of HealthChecksApiClient.
   *
   * @param {Object} [options={}] Client options.
   * @memberof HealthChecksApiClient
   */
  constructor(options = {}) {
    this._options = options;
    this._apiKey = undefined;

    // Check the options for the Api Key.
    this._checkApiKey(this._options);

    // Get the headers for the requests.
    this._headers = this._getRequestHeaders();
    this.timeout = this._options.timeout || 5000;
    this.baseUrl = this._options.baseUrl || BASE_URL;
    this.fullResponse = this._options.fullResponse || false;
    this.maxContentLength = this._options.maxContentLength || 10000;
    this.maxBodyLength = this._options.maxBodyLength || 2000;
    this.apiVersion = this._options.apiVersion || API_VERSION;

    // Create the Axios instance.
    this._axiosInstance = this._getAxiosInstance();
  }

  /**
   * Checks the provided options for the Api Key.
   *
   * @param {Object} options Provided options.
   * @memberof HealthChecksApiClient
   */
  _checkApiKey(options) {
    // Check the 'apiKey'.
    if ((!has(options, 'apiKey') && !has(process, 'env.HC_API_KEY')) &&
      isEmpty(options.apiKey)
    ) {
      throw new Error('A HealthChecks.io Api Key is a required option.');
    }

    this._apiKey = (process.env.HC_API_KEY || options.apiKey).trim();

    // Make sure the API key is not empty.
    if (!this._apiKey.length) {
      this._apiKey = undefined;
      throw new Error('A HealthChecks.io Api Key is a required option.');
    }
  }

  /**
   * Performs validation on a value using the provided Joi schema.
   *
   * @param {Array<*>} values The values to validate.
   * @param {Array<Object>} schemas Joi schemas.
   * @memberof HealthChecksApiClient
   */
  _checkInput(values, schemas) {
    values.forEach((value, index) => {
      // Validate the value with the Joi schema.
      const result = performValidation(value, schemas[index]);

      if (result.errors) {
        throw new Error(result.errors);
      }
    });
  }

  /**
   * Gets the headers for a Healthchecks.io request.
   *
   * @returns {Object} Request headers.
   * @memberof HealthChecksApiClient
   */
  _getRequestHeaders() {
    if (!this._apiKey) {
      throw new Error('Missing the Api Key (apiKey).');
    }

    return {
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Api-Key': this._apiKey,
      'User-Agent': USER_AGENT,
    };
  }

  /**
   * Creates an Axios instance.
   *
   * @returns {Axios} Axios instance.
   * @memberof HealthChecksApiClient
   */
  _getAxiosInstance() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: this._headers,
      timeout: this.timeout,
      responseType: 'json',
      responseEncoding: 'utf8',
      maxContentLength: this.maxContentLength,
      maxBodyLength: this.maxBodyLength,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  /**
   * Gets the request options for a Healthchecks.io API request.
   *
   * @param {String} method HTTP method.
   * @param {String} path HTTP request path.
   * @param {Object} [qs=null] Query parameters.
   * @param {Object} [body=null] Request body.
   * @returns {Object} Request options.
   * @memberof HealthChecksApiClient
   */
  _getRequestOptions(method, path, qs = null, body = null) {
    // Set the request options.
    const options = {
      method,
      url: path,
      params: (qs && isPlainObject(qs)) ? qs : undefined,
    };

    // Add body value (if needed).
    if (/put|post|patch|delete/i.test(method) &&
      (body && isPlainObject(body))
    ) {
      options.data = body;
    }

    return options;
  }

  /**
   * Performs a Healthchecks.io API request.
   *
   * @param {Object} options Request options.
   * @returns {Promise<Object|Array>} The response from the API request.
   * @memberof HealthChecksApiClient
   */
  async _performRequest(options) {
    // Check the options.
    if (!options || !isPlainObject(options) || isEmpty(options)) {
      throw new Error('A request options object must be provided');
    }

    // Get the response.
    const response = await this._axiosInstance.request(options);

    // Should the full response be returned.
    if (this.fullResponse) {
      // Get the status message.
      const statusMessage = response.statusText || status[response.status];

      return {
        statusCode: response.status,
        statusMessage,
        headers: response.headers,
        data: response.data,
      };
    }

    return response.data;
  }

  /**
   * Creates a custom error from an Axios error.
   *
   * @param {Error} err The 'axios' Error.
   * @returns {Error} The custom error.
   * @memberof HealthChecksApiClient
   */
  _handleError(err) {
    // Check for Axios errors.
    if (isAxiosRequestError(err)) {
      return new RequestError(err);
    } else if (isAxiosResponseError(err)) {
      return new StatusCodeError(err);
    }

    return err;
  }

  /**
   * Gets a list of health checks. If 'tags' are provided
   * then a list of health checks matching the tags is
   * returned.
   *
   * @param {Array<String>} [tags=[]] Health check tags.
   * @returns {Promise<Object>} List of health checks.
   * @memberof HealthChecksApiClient
   */
  async getChecks(tags = []) {
    // Check the tags.
    this._checkInput([ tags ], [ tagsSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/api/v${this.apiVersion}/checks/`, { tag: tags });
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Gets the information for a health check.
   *
   * @param {String} uuid Health check identifier or unique key.
   * @returns {Promise<Object>} The health check information.
   * @memberof HealthChecksApiClient
   */
  async getCheck(uuid) {
    // Check the uuid/unique key.
    this._checkInput([ uuid ], [ uuidOrUniqueKeySchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/api/v${this.apiVersion}/checks/${uuid}`);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Creates a new health check.
   *
   * @param {Object} [checkInfo={}] Check information.
   * @returns {Promise<Object>} The created health check.
   * @memberof HealthChecksApiClient
   */
  async createCheck(checkInfo = {}) {
    // Check the health check info.
    this._checkInput([ checkInfo ], [ checkSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/api/v${this.apiVersion}/checks/`, null, checkInfo);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Updates an existing health check.
   *
   * @param {String} uuid Health check identifier.
   * @param {Object} [checkInfo={}] Updated check information.
   * @returns {Promise<Object>} The updated check.
   * @memberof HealthChecksApiClient
   */
  async updateCheck(uuid, checkInfo = {}) {
    // Check the uuid and health check info.
    this._checkInput([ uuid, checkInfo ], [ uuidSchema, checkSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/api/v${this.apiVersion}/checks/${uuid}`, null, checkInfo);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Disables monitoring for a check, without removing it.
   *
   * @param {String} uuid Health check identifier.
   * @returns {Promise<Object>} The paused check information.
   * @memberof HealthChecksApiClient
   */
  async pauseCheck(uuid) {
    // Check the uuid.
    this._checkInput([ uuid ], [ uuidSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/api/v${this.apiVersion}/checks/${uuid}/pause`);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Permanently deletes the check from user's account.
   *
   * @param {String} uuid Health check identifier.
   * @returns {Promise<Object>} The deleted check.
   * @memberof HealthChecksApiClient
   */
  async deleteCheck(uuid) {
    // Check the uuid.
    this._checkInput([ uuid ], [ uuidSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('DELETE',
        `/api/v${this.apiVersion}/checks/${uuid}`);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Gets a list of pings a check has received.
   *
   * @param {String} uuid Health check identifier.
   * @returns {Promise<Object>} The list of pings.
   * @memberof HealthChecksApiClient
   */
  async listPings(uuid) {
    // Check the uuid.
    this._checkInput([ uuid ], [ uuidSchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/api/v${this.apiVersion}/checks/${uuid}/pings`);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Gets a list of flips (status changes) a check has experienced.
   *
   * @param {String} uuid Health check identifier or unique key.
   * @param {Object} [params={}] Query parameters.
   * @returns {Promise<Object>} The list of flips (status changes).
   * @memberof HealthChecksApiClient
   */
  async listFlips(uuid, params = {}) {
    // Check the uuid/unique key and query parameters.
    this._checkInput([ uuid, params ],
      [ uuidOrUniqueKeySchema, flipsQuerySchema ]);

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/api/v${this.apiVersion}/checks/${uuid}/flips`, params);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Gets a list of integrations belonging to the user.
   *
   * @returns {Promise<Object>} List of integrations.
   * @memberof HealthChecksApiClient
   */
  async getIntegrations() {
    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/api/v${this.apiVersion}/channels`);
      // Peform the request.
      return await this._performRequest(options);
    } catch (err) {
      throw this._handleError(err);
    }
  }
}

module.exports = HealthChecksApiClient;
