const axios = require('axios');
// Import the error utils.
const { RequestError, StatusCodeError,
  isAxiosRequestError, isAxiosResponseError } = require('./utils/errors');
const { uuidSchema, performValidation } = require('./utils/validation');
const { version } = require('../package.json');

// Base URL for Healthchecks.io.
const BASE_URL = 'https://hc-ping.com';
// Client user agent string.
const USER_AGENT = `HealthChecks-IO-Client/${version}`;

/**
 * A library for interacting with the Healthchecks.io pinging API
 * for submitting success, failure and job start signals from the
 * monitored systems.
 *
 * @class HealthChecksPingClient
 */
class HealthChecksPingClient {
  /**
   * Creates an instance of HealthChecksPingClient.
   *
   * @param {Object} [options={}] Client options.
   * @memberof HealthChecksPingClient
   */
  constructor(options = {}) {
    this._options = options;

    // Check for the UUID.
    this._checkUUID(this._options);

    this._uuid = this._options.uuid;
    this.timeout = this._options.timeout || 5000;
    this.baseUrl = this._options.baseUrl || BASE_URL;
    this.returnResponse = this._options.returnResponse || false;

    // Create the Axios instance.
    this._axiosInstance = this._getAxiosInstance();
  }

  /**
   * Checks the 'uuid' option.
   *
   * @param {Object} options Client options.
   * @memberof HealthChecksPingClient
   */
  _checkUUID(options) {
    if (!options.uuid) {
      throw new Error('A Healthchecks.io UUID must be provided.');
    }

    // Validate the UUID.
    const result = performValidation(options.uuid, uuidSchema);

    if (result.errors) {
      throw new Error(result.errors);
    }
  }

  /**
   * Gets the headers for a Healthchecks.io request.
   *
   * @returns {Object} Request headers.
   * @memberof HealthChecksPingClient
   */
  _getRequestHeaders() {
    return {
      'Accept': 'text/plain; charset=utf-8',
      'Content-Type': 'text/plain; charset=utf-8',
      'User-Agent': USER_AGENT,
    };
  }

  /**
   * Creates an Axios instance.
   *
   * @returns {Axios} Axios instance.
   * @memberof HealthChecksPingClient
   */
  _getAxiosInstance() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: this._getRequestHeaders(),
      timeout: this.timeout,
      responseType: 'document',
      responseEncoding: 'utf8',
    });
  }

  /**
   * Creates a custom error from an Axios error.
   *
   * @param {Error} err The 'axios' Error.
   * @returns {Error} The custom error.
   * @memberof HealthChecksPingClient
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
   * Determines if a payload value is present.
   *
   * @param {String} payload Payload string.
   * @param {Stirng} action Ping action.
   * @returns {Boolean} Has payload or not.
   * @memberof HealthChecksPingClient
   */
  _hasPayload(payload, action) {
    // Check the payload for the ping.
    if (payload) {
      // The success payload should be a string.
      if (typeof payload === 'string' || payload instanceof String) {
        return true;
      } else {
        throw new TypeError(`The ${action} payload must be a string`);
      }
    }

    return false;
  }

  /**
   * Signals to Healthchecks.io that the job has
   * completed successfully.
   *
   * @param {String} payload Payload string.
   * @returns {String} The response string.
   * @memberof HealthChecksPingClient
   */
  async success(payload) {
    // The request method.
    let method = 'get';

    // Check the payload for the success ping.
    if (this._hasPayload(payload, 'success')) {
      // Set the method.
      method = 'post';
      payload = payload.toString();
    }

    try {
      // Make the request.
      const resp = await this._axiosInstance[method](`/${this._uuid}`,
        payload);
      // Determine what to return.
      return (this.returnResponse) ? resp.data : undefined;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Signals to Healthchecks.io that the job has failed.
   *
   * @param {String} payload Payload string.
   * @returns {String} The response string.
   * @memberof HealthChecksPingClient
   */
  async fail(payload) {
    // The request method.
    let method = 'get';

    // Check the payload for the fail ping.
    if (this._hasPayload(payload, 'fail')) {
      // Set the method.
      method = 'post';
      payload = payload.toString();
    }

    try {
      // Make the request.
      const resp = await this._axiosInstance[method](`/${this._uuid}/fail`,
        payload);
      // Determine what to return.
      return (this.returnResponse) ? resp.data : undefined;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  /**
   * Sends a "job has started!" message to Healthchecks.io.
   *
   * @returns {String} The response string.
   * @memberof HealthChecksPingClient
   */
  async start() {
    try {
      // Make the request.
      const resp = await this._axiosInstance.get(`/${this._uuid}/start`);
      // Determine what to return.
      return (this.returnResponse) ? resp.data : undefined;
    } catch (err) {
      throw this._handleError(err);
    }
  }
}

/**
 * A shorthand version for performing a Healthchecks.io ping 
 * 
 * @param {String} uuid Healthchecks.io UUID.
 * @param {String} action Ping action ('success' or 'fail').
 * @param {String} payload Payload string.
 * @returns {String} The response string.
 */
const ping = async (uuid, action, payload) => {
  // Set the action.
  action = action || 'success';

  // Create the ping client.
  const pingClient = new HealthChecksPingClient({ uuid });

  if (action === 'fail') {
    // Perform the failure ping.
    return await pingClient.fail(payload);
  } else {
    // Default to the success ping for everything else.
    return await pingClient.success(payload);
  }
};

module.exports = {
  HealthChecksPingClient,
  ping,
};
