const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const nock = require('nock');
const { HealthChecksPingClient, ping } = require('../lib');

// Use 'chai-as-promised'.
chai.use(chaiAsPromised);
// Get 'expect'.
const expect = chai.expect;

const clientRewire = rewire('../lib/healthchecks_ping_client');
const baseUrl = clientRewire.__get__('BASE_URL');
const userAgent = clientRewire.__get__('USER_AGENT');

describe('Healthchecks.io Ping Client Tests', () => {
  let client;

  const clientOptions = {
    uuid: '3c1169a0-7b50-11ea-873d-3c970e75c219',
  };

  beforeEach(() => {
    client = new HealthChecksPingClient(clientOptions);
  });

  context(`'HealthChecksPingClient' Class instance`, () => {
    it(`should be an instance of 'HealthChecksPingClient'`, () => {
      expect(client).to.be.an('object');
      expect(client).to.be.an.instanceof(HealthChecksPingClient);
    });

    it(`should have a public 'constructor' method`, () => {
      expect(client.constructor).to.be.an('function');
      expect(client.constructor).to.be.an.instanceof(Function);
    });

    it(`should have a private '_checkUUID' method`, () => {
      expect(client._checkUUID).to.be.an('function');
      expect(client._checkUUID).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getRequestHeaders' method`, () => {
      expect(client._getRequestHeaders).to.be.an('function');
      expect(client._getRequestHeaders).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getAxiosInstance' method`, () => {
      expect(client._getAxiosInstance).to.be.an('function');
      expect(client._getAxiosInstance).to.be.an.instanceof(Function);
    });

    it(`should have a private '_handleError' method`, () => {
      expect(client._handleError).to.be.an('function');
      expect(client._handleError).to.be.an.instanceof(Function);
    });

    it(`should have a private '_hasPayload' method`, () => {
      expect(client._hasPayload).to.be.an('function');
      expect(client._hasPayload).to.be.an.instanceof(Function);
    });

    it(`should have a public 'success' method`, () => {
      expect(client.success).to.be.an('function');
      expect(client.success).to.be.an.instanceof(Function);
    });

    it(`should have a public 'fail' method`, () => {
      expect(client.fail).to.be.an('function');
      expect(client.fail).to.be.an.instanceof(Function);
    });

    it(`should have a public 'start' method`, () => {
      expect(client.start).to.be.an('function');
      expect(client.start).to.be.an.instanceof(Function);
    });
  });

  context('#constructor()', () => {
    it(`should have a private '_options' property`, () => {
      let otherClient;

      try {
        expect(client).to.have.property('_options');
        expect(client._options).to.be.an('object');
        expect(client._options).to.eql(clientOptions);

        otherClient = new HealthChecksPingClient();
      } catch (err) {
        expect(otherClient).to.be.undefined;
      }

      expect(() => new HealthChecksPingClient(undefined)).to.throw(Error);
    });

    it(`should have a private '_uuid' property`, () => {
      expect(client).to.have.property('_uuid');
      expect(client._uuid).to.be.a('string');
      expect(client._uuid).to.eql(clientOptions.uuid);
    });
  });

  context('#_checkUUID()', () => {
    it('should throw an error when missing a uuid', () => {
      expect(() => new HealthChecksPingClient({})).to.throw(Error);
    });

    it('should throw an error for an invalid uuid', () => {
      expect(() => new HealthChecksPingClient({ uuid: 'Test' })).to.throw(Error);
    });
  });

  context('#_getRequestHeaders()', () => {
    it('should get the request headers', () => {
      const expectedHeaders = {
        'Accept': 'text/plain; charset=utf-8',
        'Content-Type': 'text/plain; charset=utf-8',
        'User-Agent': userAgent,
      };

      const headers = client._getRequestHeaders();

      expect(headers).to.be.an('object');
      expect(headers).to.eql(expectedHeaders);
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
      err.toJSON = () => { };

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

  context('#_hasPayload()', () => {
    it('should return true for a string payload', () => {
      const result = client._hasPayload('Some string', 'success');
      const result2 = client._hasPayload(new String('Some string'), 'success');

      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
      expect(result2).to.be.a('boolean');
      expect(result2).to.be.true;
    });

    it('should return false when not given a payload', () => {
      const result = client._hasPayload(undefined, 'success');

      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('should throw an error when given a non-string payload', () => {
      expect(() => client._hasPayload({}, 'success')).to.throw(TypeError);
      expect(() => client._hasPayload([], 'success')).to.throw(TypeError);
      expect(() => client._hasPayload(999, 'success')).to.throw(TypeError);
    });
  });

  context('#success()', () => {
    it('should perform a success ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}`)
        .reply(200, 'OK');

      await expect(client.success()).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a success ping and return a response', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}`)
        .reply(200, 'OK');

      client.returnResponse = true;
      const resp = await client.success();

      expect(resp).to.be.a('string');
      expect(resp).to.eql('OK');

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a success ping with payload data', async () => {
      // Mock the API request.
      nock(baseUrl)
        .post(`/${clientOptions.uuid}`)
        .reply(200, 'OK');

      await expect(client.success('Some log data')).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should throw an error when performing a success ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}`)
        .replyWithError('Something bad happened!');

      await expect(client.success()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#fail()', () => {
    it('should perform a fail ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/fail`)
        .reply(200, 'OK');

      await expect(client.fail()).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a fail ping and return a response', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/fail`)
        .reply(200, 'OK');

      client.returnResponse = true;
      const resp = await client.fail();

      expect(resp).to.be.a('string');
      expect(resp).to.eql('OK');

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a fail ping with payload data', async () => {
      // Mock the API request.
      nock(baseUrl)
        .post(`/${clientOptions.uuid}/fail`)
        .reply(200, 'OK');

      await expect(client.fail('Some log data')).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should throw an error when performing a fail ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/fail`)
        .replyWithError('Something bad happened!');

      await expect(client.fail()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#start()', () => {
    it(`should send a 'job started' message`, async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/start`)
        .reply(200, 'OK');

      await expect(client.start()).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should send a 'job started' message and return a response`, async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/start`)
        .reply(200, 'OK');

      client.returnResponse = true;
      const resp = await client.start();

      expect(resp).to.be.a('string');
      expect(resp).to.eql('OK');

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when sending a 'job started' message`, async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${clientOptions.uuid}/start`)
        .replyWithError('Something bad happened!');

      await expect(client.start()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });
});

describe('Healthchecks.io Ping Tests', () => {
  // Mock UUID.
  const uuid = '3c1169a0-7b50-11ea-873d-3c970e75c219';

  context('#ping()', () => {
    it('should perform a success ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${uuid}`)
        .reply(200, 'OK');

      await expect(ping(uuid, 'success')).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a success ping by default', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${uuid}`)
        .reply(200, 'OK');

      await expect(ping(uuid)).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });

    it('should perform a fail ping', async () => {
      // Mock the API request.
      nock(baseUrl)
        .get(`/${uuid}/fail`)
        .reply(200, 'OK');

      await expect(ping(uuid, 'fail')).to.be.fulfilled;

      // Remove the mocks.
      nock.cleanAll();
    });
  });
});