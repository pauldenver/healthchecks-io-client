const { expect } = require('chai');
const rewire = require('rewire');
const { uuidSchema, tagsSchema,
  checkSchema, performValidation } = require('../../lib/utils/validation');

const validationRewire = rewire('../../lib/utils/validation');
const timeoutMin = validationRewire.__get__('TIMEOUT_MIN');
const timeoutMax = validationRewire.__get__('TIMEOUT_MAX');

describe('Validation Util Tests', () => {
  let result;

  /*
   * Properties in an health check object
   * that requires string validation.
   */
  const stringProps = [
    'name',
    'tags',
    'desc',
    'schedule',
    'tz',
    'channels',
  ];

  /*
   * Properties in an health check object
   * that requires integer validation.
   */
  const integerProps = ['timeout', 'grace'];

  context('#performValidation()', () => {
    it('should validate a valid uuid as true', () => {
      result = performValidation(
        '3c1169a0-7b50-11ea-873d-3c970e75c219', uuidSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });
    });

    it('should validate an invalid uuid as false', () => {
      result = performValidation(
        'not a valid uuid', uuidSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'uuid' must be a valid UUID string`
      });

      result = performValidation(888, uuidSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'uuid' must be a string`
      });

      result = performValidation('', uuidSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'uuid' cannot be empty`
      });

      result = performValidation(undefined, uuidSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'uuid' is a required value`
      });
    });

    it(`should validate a valid 'tags' value as true`, () => {
      result = performValidation(['prod', 'app'], tagsSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });

      result = performValidation([], tagsSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });
    });

    it(`should validate an invalid 'tags' value as false`, () => {
      result = performValidation({}, tagsSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'tags' must be an array of strings`
      });

      result = performValidation([25, 50], tagsSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'tags' must be an array of strings`
      });
    });

    it(`should validate a valid health check value as true`, () => {
      // Iterate through the properties.
      stringProps.forEach((prop) => {
        result = performValidation({ [prop]: 'some string' }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({ valid: true });

        result = performValidation({ [prop]: '' }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({ valid: true });

        result = performValidation({ [prop]: null }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({ valid: true });
      });

      // Iterate through the properties.
      integerProps.forEach((prop) => {
        result = performValidation({ [prop]: 200 }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({ valid: true });

        result = performValidation({ [prop]: null }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({ valid: true });
      });

      result = performValidation({ unique: [ 'name' ] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });

      result = performValidation({ unique: [ 'name', 'grace' ] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });

      result = performValidation({ unique: null }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });

      result = performValidation({ unique: [] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({ valid: true });
    });

    it(`should validate a valid health check value as false`, () => {
      // Iterate through the properties.
      stringProps.forEach((prop) => {
        result = performValidation({ [prop]: 45 }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be a string`
        });

        result = performValidation({ [prop]: {} }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be a string`
        });
      });

      // Iterate through the properties.
      integerProps.forEach((prop) => {
        result = performValidation({ [prop]: 'not an integer' }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be an integer between ` +
          `${timeoutMin} and ${timeoutMax}`
        });

        result = performValidation({ [prop]: 99.9 }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be an integer between ` +
          `${timeoutMin} and ${timeoutMax}`
        });

        result = performValidation({ [prop]: 32 }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be larger than or equal to ${timeoutMin}`
        });

        result = performValidation({ [prop]: timeoutMax + 100 }, checkSchema);

        expect(result).to.be.an('object');
        expect(result).to.eql({
          valid: false,
          errors: `The '${prop}' value must be smaller than or equal to ${timeoutMax}`
        });
      });
      
      result = performValidation({ unique: {} }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'unique' value must be an array of strings`
      });

      result = performValidation({ unique: 25 }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `The 'unique' value must be an array of strings`
      });

      result = performValidation({ unique: [ 88 ] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `A 'unique' item must be a string that equals either 'name', ` +
          `'tags', 'timeout', or 'grace'`
      });

      result = performValidation({ unique: [ '' ] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `A 'unique' item must be a string that equals either 'name', ` +
          `'tags', 'timeout', or 'grace'`
      });

      result = performValidation({ unique: [ 45, 88, {} ] }, checkSchema);

      expect(result).to.be.an('object');
      expect(result).to.eql({
        valid: false,
        errors: `A 'unique' item must be a string that equals either 'name', ` +
          `'tags', 'timeout', or 'grace'`
      });
    });
  });
});