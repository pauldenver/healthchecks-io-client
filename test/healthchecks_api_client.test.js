const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const nock = require('nock');
const { HealthChecksApiClient } = require('../lib');
const { uuidSchema } = require('../lib/utils/validation');

// Use 'chai-as-promised'.
chai.use(chaiAsPromised);
// Get 'expect'.
const expect = chai.expect;

const clientRewire = rewire('../lib/healthchecks_api_client');
const baseUrl = clientRewire.__get__('BASE_URL');
const userAgent = clientRewire.__get__('USER_AGENT');

describe('Healthchecks.io API Client Tests', () => {
  let client;
  let reqHeaders;

  const clientOptions = {
    apiKey: '5606f20bd449cfb873d82f59fecb7bba'
  };

  beforeEach(() => {
    client = new HealthChecksApiClient(clientOptions);

    reqHeaders = { reqheaders: client._headers };
  });
  
  context(`'HealthChecksApiClient' Class instance`, () => {
    it(`should be an instance of 'HealthChecksApiClient'`, () => {
      expect(client).to.be.an('object');
      expect(client).to.be.an.instanceof(HealthChecksApiClient);
    });

    it(`should have a public 'constructor' method`, () => {
      expect(client.constructor).to.be.an('function');
      expect(client.constructor).to.be.an.instanceof(Function);
    });

    it(`should have a private '_checkApiKey' method`, () => {
      expect(client._checkApiKey).to.be.an('function');
      expect(client._checkApiKey).to.be.an.instanceof(Function);
    });

    it(`should have a private '_checkInput' method`, () => {
      expect(client._checkInput).to.be.an('function');
      expect(client._checkInput).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getRequestHeaders' method`, () => {
      expect(client._getRequestHeaders).to.be.an('function');
      expect(client._getRequestHeaders).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getAxiosInstance' method`, () => {
      expect(client._getAxiosInstance).to.be.an('function');
      expect(client._getAxiosInstance).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getRequestOptions' method`, () => {
      expect(client._getRequestOptions).to.be.an('function');
      expect(client._getRequestOptions).to.be.an.instanceof(Function);
    });

    it(`should have a private '_performRequest' method`, () => {
      expect(client._performRequest).to.be.an('function');
      expect(client._performRequest).to.be.an.instanceof(Function);
    });

    it(`should have a private '_handleError' method`, () => {
      expect(client._handleError).to.be.an('function');
      expect(client._handleError).to.be.an.instanceof(Function);
    });

    it(`should have a public 'getChecks' method`, () => {
      expect(client.getChecks).to.be.an('function');
      expect(client.getChecks).to.be.an.instanceof(Function);
    });

    it(`should have a public 'getCheck' method`, () => {
      expect(client.getCheck).to.be.an('function');
      expect(client.getCheck).to.be.an.instanceof(Function);
    });

    it(`should have a public 'createCheck' method`, () => {
      expect(client.createCheck).to.be.an('function');
      expect(client.createCheck).to.be.an.instanceof(Function);
    });

    it(`should have a public 'updateCheck' method`, () => {
      expect(client.updateCheck).to.be.an('function');
      expect(client.updateCheck).to.be.an.instanceof(Function);
    });

    it(`should have a public 'pauseCheck' method`, () => {
      expect(client.pauseCheck).to.be.an('function');
      expect(client.pauseCheck).to.be.an.instanceof(Function);
    });

    it(`should have a public 'deleteCheck' method`, () => {
      expect(client.deleteCheck).to.be.an('function');
      expect(client.deleteCheck).to.be.an.instanceof(Function);
    });

    it(`should have a public 'listPings' method`, () => {
      expect(client.listPings).to.be.an('function');
      expect(client.listPings).to.be.an.instanceof(Function);
    });

    it(`should have a public 'listFlips' method`, () => {
      expect(client.listFlips).to.be.an('function');
      expect(client.listFlips).to.be.an.instanceof(Function);
    });

    it(`should have a public 'getIntegrations' method`, () => {
      expect(client.getIntegrations).to.be.an('function');
      expect(client.getIntegrations).to.be.an.instanceof(Function);
    });
  });

  context('#constructor()', () => {
    it(`should have a private '_options' property`, () => {
      let otherClient;
      
      expect(client).to.have.property('_options');
      expect(client._options).to.be.an('object');
      expect(client._options).to.eql(clientOptions);

      expect(() => {
        otherClient = new HealthChecksApiClient();
      }).to.throw();
      expect(otherClient).to.be.undefined;
    });

    it(`should have a private '_apiKey' property`, () => {
      expect(client).to.have.property('_apiKey');
      expect(client._apiKey).to.be.a('string');
      expect(client._apiKey).to.eql(clientOptions.apiKey);
    });
  });

  context('#_checkApiKey()', () => {
    it('should check and set the apiKey', () => {
      const options = {
        apiKey: '99hf9a9fy9qhuav29sy53gds4ilsu'
      };

      client._checkApiKey(options);

      expect(client._apiKey).to.be.a('string');
      expect(client._apiKey).to.eql(options.apiKey);
    });

    it(`should throw an error when missing the 'apiKey'`, () => {
      expect(() => client._checkApiKey({})).to.throw(Error,
        'A HealthChecks.io Api Key is a required option.');
    });

    it(`should throw an error when the 'apiKey' is empty`, () => {
      const options = {
        apiKey: ''
      };

      expect(() => client._checkApiKey(options)).to.throw(Error,
        'A HealthChecks.io Api Key is a required option.');
    });
  });

  context('#_checkInput()', () => {
    it('should validate a valid input value', () => {
      expect(() => {
        client._checkInput(
          [ '3c1169a0-7b50-11ea-873d-3c970e75c219' ],
          [ uuidSchema ]
        );
      }).to.not.throw();
    });

    it('should throw an error for an invalid input value', () => {
      expect(() => {
        client._checkInput([ 'Not a UUID' ], [ uuidSchema ]);
      }).to.throw(Error);
    });
  });

  context('#_getRequestHeaders()', () => {
    it('should get the request headers', () => {
      const expectedHeaders = {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Api-Key': clientOptions.apiKey,
        'User-Agent': userAgent,
      };

      const headers = client._getRequestHeaders();

      expect(headers).to.be.an('object');
      expect(headers).to.eql(expectedHeaders);
    });

    it(`should throw an error when missing the 'apiKey'`, () => {
      client._apiKey = null;

      expect(() => client._getRequestHeaders()).to.throw(Error,
        'Missing the Api Key (apiKey).');
    });
  });

  context('#_getRequestOptions()', () => {
    it('should get the request options without query parameters or body', () => {
      // Get the options.
      const options = client._getRequestOptions('GET', '/api/v1/checks/');

      expect(options).to.be.an('object');
      expect(options).to.have.property('url', '/api/v1/checks/');
      expect(options).to.have.property('method', 'GET');
      expect(options.params).to.be.undefined;
      expect(options.data).to.be.undefined;
    });

    it('should get the request options with query parameters and without a body', () => {
      const query = {
        data: 'Some value'
      };

      // Get the options.
      const options = client._getRequestOptions('GET',
        '/api/v1/checks/', query);

      expect(options).to.be.an('object');
      expect(options).to.have.property('url', '/api/v1/checks/');
      expect(options).to.have.property('method', 'GET');
      expect(options).to.have.property('params');
      expect(options.params).to.be.an('object');
      expect(options.params).to.eql(query);
      expect(options.data).to.be.undefined;
    });

    it('should get the request options with a body and without query parameters', () => {
      const body = {
        name: 'Example Check',
        tags: 'prod app',
      };
  
      // Get the options.
      const options = client._getRequestOptions('POST',
        '/api/v1/checks/', null, body);
  
      expect(options).to.be.an('object');
      expect(options).to.have.property('url', '/api/v1/checks/');
      expect(options).to.have.property('method', 'POST');
      expect(options).to.have.property('data');
      expect(options.data).to.be.an('object');
      expect(options.data).to.eql(body);
      expect(options.params).to.be.undefined;
    });
  });

  context('#_performRequest()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      name: 'Example Check',
      tags: 'prod',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'new',
      last_ping: null,
      next_ping: null,
      ping_url: `https://hc-ping.com/${checkUuid}`,
      update_url: `https://healthchecks.io/api/v1/checks/${checkUuid}`,
      pause_url: `https://healthchecks.io/api/v1/checks/${checkUuid}/pause`,
      channels: '',
      timeout: 86400
    };

    const fullResponse = {
      statusCode: 200,
      statusMessage: 'OK',
      headers: { 'content-type': 'application/json' },
      data: response,
    };

    it('should return a Healthcheck.io API response', async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}`)
        .reply(200, response);

      // Get the options.
      const options = client._getRequestOptions('GET',
        `/api/v1/checks/${checkUuid}`);

      // Perform the request.
      const healthCheck = await client._performRequest(options);

      expect(healthCheck).to.be.an('object');
      expect(healthCheck).to.eql(response);

      nock.cleanAll();
    });

    it('should return a full Healthcheck.io API response', async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}`)
        .reply(200, response);

      // Set the full response option.
      client.fullResponse = true;

      // Get the options.
      const options = client._getRequestOptions('GET',
        `/api/v1/checks/${checkUuid}`);

      // Perform the request.
      const resp = await client._performRequest(options);

      expect(resp).to.be.an('object');
      expect(resp).to.have.property('statusCode');
      expect(resp).to.have.property('statusMessage');
      expect(resp).to.have.property('headers');
      expect(resp).to.have.property('data');
      expect(resp).to.eql(fullResponse);

      nock.cleanAll();
    });

    it('should throw an error when missing the request options', async () => {
      await expect(client._performRequest()).to.be.rejectedWith(Error);
      await expect(client._performRequest('something')).to.be.rejectedWith(Error);
      await expect(client._performRequest([])).to.be.rejectedWith(Error);
      await expect(client._performRequest({})).to.be.rejectedWith(Error);
    });
  });

  context('#_handleError()', () => {
    it(`should return a 'StatusCodeError' error`, () => {
      const statusCode = 403;
      const statusText = 'Authentication failed or rate-limit reached';

      const err = new Error(`Request failed with status code ${statusCode}`);

      // Mock Axios response object.
      err.response = {
        status: statusCode,
        statusText,
        headers: {},
        data: 'Bad stuff',
      };

      // Add the typical Axios error values.
      err.code = null;
      err.config = {};
      err.request = {};
      err.isAxiosError = true;
      err.toJSON = () => {};

      // Create the error.
      const handledErr = client._handleError(err);

      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr.name).to.eql('StatusCodeError');
      expect(handledErr.message).to.eql(String(err));
      expect(handledErr.statusCode).to.eql(statusCode);
      expect(handledErr.statusMessage).to.eql(statusText);
      expect(handledErr.headers).to.eql({});
      expect(handledErr.body).to.eql('Bad stuff');
      expect(handledErr).to.have.property('cause');
      expect(handledErr.cause).to.be.an.instanceof(Error);
      expect(handledErr.cause.message).to.eql(err.message);
    });

    it(`should return a 'RequestError' error`, () => {
      const err = new Error('Oops, something happened');
      err.config = {};
      err.response = undefined;

      // Create the error.
      const handledErr = client._handleError(err);

      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr.name).to.eql('RequestError');
      expect(handledErr.message).to.eql(String(err));
      expect(handledErr).to.have.property('cause');
      expect(handledErr.cause).to.be.an.instanceof(Error);
      expect(handledErr.cause.message).to.eql(err.message);
    });

    it(`should return an unmodified error`, () => {
      const err = new Error('Oops, something happened');
  
      // Create the error.
      const handledErr = client._handleError(err);
  
      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr).to.eql(err);
    });
  });

  context('#getChecks()', () => {
    const response = {
      checks: [
        {
          name: 'App Check',
          tags: 'prod app',
          desc: '',
          grace: 3600,
          n_pings: 0,
          status: 'new',
          last_ping: null,
          next_ping: null,
          ping_url: 'https://hc-ping.com/5c5caa20-7b65-11ea-aace-3c970e75c219',
          update_url: 'https://healthchecks.io/api/v1/checks/5c5caa20-7b65-11ea-aace-3c970e75c219',
          pause_url: 'https://healthchecks.io/api/v1/checks/5c5caa20-7b65-11ea-aace-3c970e75c219/pause',
          channels: '',
          timeout: 86400
        },
        {
          name: 'Server Check',
          tags: 'prod server',
          desc: '',
          grace: 3600,
          n_pings: 0,
          status: 'new',
          last_ping: null,
          next_ping: null,
          ping_url: 'https://hc-ping.com/74e17d00-7b65-11ea-93f2-3c970e75c219',
          update_url: 'https://healthchecks.io/api/v1/checks/74e17d00-7b65-11ea-93f2-3c970e75c219',
          pause_url: 'https://healthchecks.io/api/v1/checks/74e17d00-7b65-11ea-93f2-3c970e75c219',
          channels: '',
          timeout: 86400
        }
      ]
    };

    it(`should return a list of health checks`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get('/api/v1/checks/')
        .reply(200, response);

      const healthChecks = await client.getChecks();

      expect(healthChecks).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting the health checks`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get('/api/v1/checks/')
        .replyWithError('Something bad happened!');

      await expect(client.getChecks()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#getCheck()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      name: 'Example Check',
      tags: 'prod',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'new',
      last_ping: null,
      next_ping: null,
      ping_url: `https://hc-ping.com/${checkUuid}`,
      update_url: `https://healthchecks.io/api/v1/checks/${checkUuid}`,
      pause_url: `https://healthchecks.io/api/v1/checks/${checkUuid}/pause`,
      channels: '',
      timeout: 86400
    };

    it(`should return a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}`)
        .reply(200, response);

      const healthCheck = await client.getCheck(checkUuid);

      expect(healthCheck).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}`)
        .replyWithError('Something bad happened!');

      await expect(client.getCheck(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#createCheck()', () => {
    const response = {
      name: 'App Check',
      tags: 'prod app',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'new',
      last_ping: null,
      next_ping: null,
      ping_url: 'https://hc-ping.com/5c5caa20-7b65-11ea-aace-3c970e75c219',
      update_url: 'https://healthchecks.io/api/v1/checks/5c5caa20-7b65-11ea-aace-3c970e75c219',
      pause_url: 'https://healthchecks.io/api/v1/checks/5c5caa20-7b65-11ea-aace-3c970e75c219/pause',
      channels: '',
      timeout: 86400
    };

    it(`should create a new health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post('/api/v1/checks/')
        .reply(200, response);

      const healthCheck = await client.createCheck({
        name: 'App Check',
        tags: 'prod app',
      });

      expect(healthCheck).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when creating a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post('/api/v1/checks/')
        .replyWithError('Something bad happened!');

      await expect(client.createCheck()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#updateCheck()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      name: 'Example Check',
      tags: 'prod app',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'new',
      last_ping: null,
      next_ping: null,
      ping_url: `https://hc-ping.com/${checkUuid}`,
      update_url: `https://healthchecks.io/api/v1/checks/${checkUuid}`,
      pause_url: `https://healthchecks.io/api/v1/checks/${checkUuid}/pause`,
      channels: '',
      timeout: 86400
    };

    it(`should update a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post(`/api/v1/checks/${checkUuid}`)
        .reply(200, response);

      const healthCheck = await client.updateCheck(checkUuid, {
        tags: 'prod app',
      });

      expect(healthCheck).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when updating a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post(`/api/v1/checks/${checkUuid}`)
        .replyWithError('Something bad happened!');

      await expect(client.updateCheck(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#pauseCheck()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      name: 'Example Check',
      tags: 'prod app',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'paused',
      last_ping: null,
      next_ping: null,
      ping_url: `https://hc-ping.com/${checkUuid}`,
      update_url: `https://healthchecks.io/api/v1/checks/${checkUuid}`,
      pause_url: `https://healthchecks.io/api/v1/checks/${checkUuid}/pause`,
      channels: '',
      timeout: 86400
    };

    it(`should pause a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post(`/api/v1/checks/${checkUuid}/pause`)
        .reply(200, response);

      const healthCheck = await client.pauseCheck(checkUuid);

      expect(healthCheck).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when pausing a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .post(`/api/v1/checks/${checkUuid}/pause`)
        .replyWithError('Something bad happened!');

      await expect(client.pauseCheck(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#deleteCheck()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      name: 'Example Check',
      tags: 'prod app',
      desc: '',
      grace: 3600,
      n_pings: 0,
      status: 'new',
      last_ping: null,
      next_ping: null,
      ping_url: `https://hc-ping.com/${checkUuid}`,
      update_url: `https://healthchecks.io/api/v1/checks/${checkUuid}`,
      pause_url: `https://healthchecks.io/api/v1/checks/${checkUuid}/pause`,
      channels: '',
      timeout: 86400
    };

    it(`should delete a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .delete(`/api/v1/checks/${checkUuid}`)
        .reply(200, response);

      const healthCheck = await client.deleteCheck(checkUuid);

      expect(healthCheck).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when deleting a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .delete(`/api/v1/checks/${checkUuid}`)
        .replyWithError('Something bad happened!');

      await expect(client.deleteCheck(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#listPings()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      pings: [
        {
          type: 'success',
          date: '2020-11-22T16:43:37.284169+00:00',
          n: 124,
          scheme: 'https',
          remote_addr: '127.0.0.1',
          method: 'POST',
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
        },
        {
          type: 'success',
          date: '2020-11-21T16:50:55.788416+00:00',
          n: 123,
          scheme: 'https',
          remote_addr: '127.0.0.1',
          method: 'GET',
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
        }
      ]
    };

    it(`should return a list of pings for a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}/pings`)
        .reply(200, response);

      const pings = await client.listPings(checkUuid);

      expect(pings).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting a list of pings`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}/pings`)
        .replyWithError('Something bad happened!');

      await expect(client.listPings(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#listFlips()', () => {
    const checkUuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

    const response = {
      flips: [
        { timestamp: '2020-11-23T17:43:37+00:00', up: 0 },
        { timestamp: '2020-11-21T16:50:55+00:00', up: 1 },
        { timestamp: '2020-11-12T16:54:03+00:00', up: 0 },
        { timestamp: '2020-11-11T14:24:57+00:00', up: 1 },
        { timestamp: '2020-11-09T18:17:37+00:00', up: 0 },
        { timestamp: '2020-11-07T16:39:59+00:00', up: 1 },
      ]
    };

    it(`should return a list of flips for a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}/flips`)
        .reply(200, response);

      const flips = await client.listFlips(checkUuid);

      expect(flips).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should return a filtered list of flips for a health check`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}/flips`)
        .query({ seconds: 3600 })
        .reply(200, { flips: [ response.flips[2] ] });

      const flips = await client.listFlips(checkUuid, { seconds: 3600 });

      expect(flips).to.eql({ flips: [ response.flips[2] ] });

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting a list of flips`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get(`/api/v1/checks/${checkUuid}/flips`)
        .replyWithError('Something bad happened!');

      await expect(client.listFlips(checkUuid)).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#getIntegrations()', () => {
    const response = {
      channels: [
        {
          id: 'bd5957e8-7b69-11ea-92d4-3c970e75c219',
          name: 'Personal',
          kind: 'email'
        }
      ]
    };

    it(`should return a list of integrations`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get('/api/v1/channels')
        .reply(200, response);

      const integrations = await client.getIntegrations();

      expect(integrations).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting the integrations`, async () => {
      // Mock the API request.
      nock(baseUrl, reqHeaders)
        .get('/api/v1/channels')
        .replyWithError('Something bad happened!');

      await expect(client.getIntegrations()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });
});