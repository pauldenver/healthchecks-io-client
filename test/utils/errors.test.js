const { expect } = require('chai');
const {
  RequestError,
  StatusCodeError,
  isAxiosRequestError,
  isAxiosResponseError
} = require('../../lib/utils/errors');
const status = require('../../lib/utils/status');

describe('Errors Util Tests', () => {
  describe('RequestError Class', () => {
    let requestErr;

    const err = new Error('Oops, something happened');
    err.config = {};
    err.response = undefined;

    beforeEach(() => {
      requestErr = new RequestError(err);
    });

    context(`'RequestError' Class instance`, () => {
      it(`should be an instance of 'RequestError'`, () => {
        expect(requestErr).to.be.an.instanceof(Error);
        expect(requestErr).to.be.an.instanceof(RequestError);
      });

      it(`should have a public 'constructor' method`, () => {
        expect(requestErr.constructor).to.be.an('function');
        expect(requestErr.constructor).to.be.an.instanceof(Function);
      });
    });

    context('#constructor()', () => {
      it(`should have a public 'name' property`, () => {
        expect(requestErr).to.have.property('name');
        expect(requestErr.name).to.be.a('string');
        expect(requestErr.name).to.eql('RequestError');
      });

      it(`should have a public 'message' property`, () => {
        expect(requestErr).to.have.property('message');
        expect(requestErr.message).to.be.a('string');
        expect(requestErr.message).to.eql(String(err));
      });

      it(`should have a public 'cause' property`, () => {
        expect(requestErr).to.have.property('cause');
        expect(requestErr.cause).to.be.an.instanceof(Error);
        expect(requestErr.cause.message).to.eql(err.message);
      });
    });
  });

  describe('StatusCodeError Class', () => {
    let statusCodeErr;
    let err;

    const statusCode = 403;
    const statusText = 'Authentication failed or rate-limit reached';

    const getRespError = () => {
      err = new Error(`Request failed with status code ${statusCode}`);

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
    };

    beforeEach(() => {
      getRespError();
      statusCodeErr = new StatusCodeError(err);
    });

    context(`'StatusCodeError' Class instance`, () => {
      it(`should be an instance of 'StatusCodeError'`, () => {
        expect(statusCodeErr).to.be.an.instanceof(Error);
        expect(statusCodeErr).to.be.an.instanceof(StatusCodeError);
      });

      it(`should have a public 'constructor' method`, () => {
        expect(statusCodeErr.constructor).to.be.an('function');
        expect(statusCodeErr.constructor).to.be.an.instanceof(Function);
      });
    });

    context('#constructor()', () => {
      it(`should have a public 'name' property`, () => {
        expect(statusCodeErr).to.have.property('name');
        expect(statusCodeErr.name).to.be.a('string');
        expect(statusCodeErr.name).to.eql('StatusCodeError');
      });

      it(`should have a public 'message' property`, () => {
        expect(statusCodeErr).to.have.property('message');
        expect(statusCodeErr.message).to.be.a('string');
        expect(statusCodeErr.message).to.eql(String(err));
      });

      it(`should have a public 'statusCode' property`, () => {
        expect(statusCodeErr).to.have.property('statusCode');
        expect(statusCodeErr.statusCode).to.be.a('number');
        expect(statusCodeErr.statusCode).to.eql(statusCode);
      });

      it(`should have a public 'statusMessage' property`, () => {
        expect(statusCodeErr).to.have.property('statusMessage');
        expect(statusCodeErr.statusMessage).to.be.a('string');
        expect(statusCodeErr.statusMessage).to.eql(statusText);

        // Create an instance without a 'statusText' property.
        getRespError();
        delete err.response.statusText;
        statusCodeErr = new StatusCodeError(err);

        expect(statusCodeErr.statusMessage).to.eql(status[statusCode]);
      });

      it(`should have a public 'headers' property`, () => {
        expect(statusCodeErr).to.have.property('headers');
        expect(statusCodeErr.headers).to.be.an('object');
        expect(statusCodeErr.headers).to.eql({});
      });

      it(`should have a public 'body' property`, () => {
        expect(statusCodeErr).to.have.property('body');
        expect(statusCodeErr.body).to.be.a('string');
        expect(statusCodeErr.body).to.eql('Bad stuff');
      });

      it(`should have a public 'cause' property`, () => {
        expect(statusCodeErr).to.have.property('cause');
        expect(statusCodeErr.cause).to.be.an.instanceof(Error);
        expect(statusCodeErr.cause.message).to.eql(err.message);
      });
    });
  });

  describe('#isAxiosRequestError()', () => {
    // Create the request error.
    const err = new Error('Oops, something happened');
    err.config = {};
    err.response = undefined;

    it('should return true for a valid request error', () => {
      // Get the result.
      const result = isAxiosRequestError(err);

      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });

    it('should return false for an invalid request error', () => {
      // Add a response value.
      err.response = {
        status: 200,
      }; 

      // Get the result.
      const result = isAxiosRequestError(err);

      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });
  });

  describe('#isAxiosResponseError()', () => {
    // Create the response error.
    const err = new Error('Oops, something happened');
    err.response = {
      status: 200,
    };

    it('should return true for a valid response error', () => {
      // Get the result.
      const result = isAxiosResponseError(err);

      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });

    it('should return false for an invalid response error', () => {
      err.response.status = undefined;

      // Get the result.
      const result = isAxiosResponseError(err);

      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });
  });
});