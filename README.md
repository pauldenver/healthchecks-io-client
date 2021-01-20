# <span>Healthchecks</span>&#46;io API Client  ![GitHub package.json version](https://img.shields.io/github/package-json/v/pauldenver/healthchecks-io-client)  [![Build Status](https://travis-ci.com/pauldenver/healthchecks-io-client.svg?branch=master)](https://travis-ci.com/pauldenver/healthchecks-io-client) [![Coverage Status](https://coveralls.io/repos/github/pauldenver/healthchecks-io-client/badge.svg?branch=master)](https://coveralls.io/github/pauldenver/healthchecks-io-client?branch=master)  [![codecov](https://codecov.io/gh/pauldenver/healthchecks-io-client/branch/master/graph/badge.svg)](https://codecov.io/gh/pauldenver/healthchecks-io-client)

The `healthchecks-io-client` library contains two simple and convenient HTTP clients for making requests to
the [Healthchecks.io Ping API](https://healthchecks.io/docs/http_api/) and the [Healthchecks.io Management API](https://healthchecks.io/docs/api/).

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Intialize the client](#initialize-the-client)
    - [Importing](#example-import-methods)
    - [Set environment variables in an application](#using-environment-variables-in-an-application)
    - [Set environment variables on the command line](#setting-environment-variables-before-running-an-application)
    - [Options](#options)
      - [Ping API Client Options](#healthcheckspingclient-options)
      - [Management API Client Options](#healthchecksapiclient-options)
- [Examples](#examples)
  - [Ping API Client Examples](#healthcheckspingclient-examples)
  - [Management API Client Examples](#healthchecksapiclient-examples)
- [Documentation](#documentation)
  - [Ping API Client Documentation](#healthcheckspingclient-documentation)
  - [Ping Wrapper Documentation](#ping-wrapper-documentation)
  - [Management API Client Documentation](#healthchecksapiclient-documentation)
- [Change Log](#change-log)
- [License](#license)

## Installation

Using NPM:

```bash
$ npm install healthchecks-io-client
```

Using Yarn:

```bash
$ yarn add healthchecks-io-client
```

## Usage

### Initializing a client

The library exports two classes for interacting with the <span>Healthchecks</span>&#46;io APIs and a `ping` shorthand/wrapper function. The `HealthChecksPingClient` class interacts with the [Healthchecks.io Ping API](https://healthchecks.io/docs/http_api/). The `HealthChecksApiClient` class interacts with the [Healthchecks.io Management API](https://healthchecks.io/docs/api/).

For a `HealthChecksPingClient` instance, you'll need the `uuid` of a health check. For a `HealthChecksApiClient` instance, you'll need an API key provided by <span>Healthchecks</span>&#46;io. You can provide the API key as an `apiKey` option or set the API key as an environment variable using `HC_API_KEY`. By default, the client will use the `HC_API_KEY` environment variable if the `apiKey` option is not provided.  

#### Example import methods:

```javascript
const {
  HealthChecksPingClient,
  HealthChecksApiClient
} = require('healthchecks-io-client');

// Creating a ping API client.
const pingClient = new HealthChecksPingClient({
  uuid: 'HEALTH-CHECKS-UUID'
});

// Creating a management API client.
const apiClient = new HealthChecksApiClient({
  apiKey: 'HEALTH-CHECKS-API-KEY'
});
```

```javascript
import {
  HealthChecksPingClient,
  HealthChecksApiClient
} from 'healthchecks-io-client';

// Creating a ping API client.
const pingClient = new HealthChecksPingClient({
  uuid: 'HEALTH-CHECKS-UUID'
});

// Creating a management API client.
const apiClient = new HealthChecksApiClient({
  apiKey: 'HEALTH-CHECKS-API-KEY'
});
```

For a `HealthChecksApiClient` instance, it is required to set the API key parameter as either an environment variable or as an option when instantiating the client. An API key is necessary to execute `HealthChecksApiClient` calls. If an API key is not provided or cannot be determined, then an error is thrown.

#### Using environment variables in an application:

```javascript
const { HealthChecksApiClient } = require('healthchecks-io-client');

// Set the API key as an environment variable.
process.env.HC_API_KEY = 'HEALTH-CHECKS-API-KEY';

const apiClient = new HealthChecksApiClient();
```

#### Setting environment variables before running an application:

Linux:

```bash
$ HC_API_KEY=HEALTH-CHECKS-API-KEY node app.js
```

Windows:

```batch
> cmd /C "set HC_API_KEY=HEALTH-CHECKS-API-KEY && node app.js"
```

### Options

#### `HealthChecksPingClient` Options:  

These are the available options for creating a `HealthChecksPingClient` instance.

| Name                | Default                      |  Description                                                 |
| ------------------- | ---------------------------- | ------------------------------------------------------------ |  
| `uuid`              | `undefined`                  | UUID of an existing health check                             |
| `timeout`           | `5000`                       | Number of milliseconds before the request times out          |
| `baseUrl`           | `https://hc-ping.com`        | Base URL for the <span>Healthchecks</span>&#46;io Ping API   |
| `returnResponse`    | `false`                      | Return the response from the request                         |  
<br />

#### `HealthChecksApiClient` Options:  

These are the available options for creating a `HealthChecksApiClient` instance.

| Name                | Default                      |  Description                                                      |
| ------------------- | ---------------------------- | ----------------------------------------------------------------- | 
| `apiKey`            | `undefined`                  | <span>Healthchecks</span>&#46;io API Key                          |
| `timeout`           | `5000`                       | Number of milliseconds before the request times out               |
| `baseUrl`           | `https://healthchecks.io`    | Base URL for the <span>Healthchecks</span>&#46;io Management API  |
| `fullResponse`      | `false`                      | Get the full response instead of just the body                    |
| `maxContentLength`  | `10000`                      | The max size of the HTTP response content in bytes                |
| `maxBodyLength`     | `2000`                       | The max allowed size of the HTTP request body in bytes            |  
<br />

## Examples

#### `HealthChecksPingClient` Examples:

Create an instance:

```javascript
const { HealthChecksPingClient } = require('healthchecks-io-client');

// Creating a ping API client.
const pingClient = new HealthChecksPingClient({
  uuid: 'HEALTH-CHECKS-UUID'
});
```

Send a "success" ping:

```javascript
async function performTask() {
  /*
   * Add task logic here.
   */

  // Signal a "success" after completion.
  await pingClient.success();
}
```

Send a "success" ping on task completion and send a "fail" ping on task failure:

```javascript
async function performTask() {
  try {
    /*
     * Add task logic here.
     */

    // Signal a "success" after completion.
    await pingClient.success();
  } catch(err) {
    // Send a "fail" ping on failure.
    await pingClient.fail();
  }
}
```

Alternatively, instead of exporting the `HealthChecksPingClient` you can export just the ping functionality.

```javascript
// Export the 'ping' function.
const { ping } = require('healthchecks-io-client');
```

Send a "success" ping:

```javascript
async function performTask(uuid) {
  /*
   * Add task logic here.
   */

  // Signal a "success" after completion.
  await ping(uuid, 'success');
}
```

Send a "success" ping on task completion and send a "fail" ping on task failure:

```javascript
async function performTask(uuid) {
  try {
    /*
     * Add task logic here.
     */

    // Signal a "success" after completion.
    await ping(uuid);
  } catch(err) {
    // Send a "fail" ping on failure.
    await ping(uuid, 'fail');
  }
}
```

#### `HealthChecksApiClient` Examples:

Create an instance:

```javascript
const { HealthChecksApiClient } = require('healthchecks-io-client');

// Creating a management API client.
const apiClient = new HealthChecksApiClient({
  apiKey: 'HEALTH-CHECKS-API-KEY'
});
```

Get a list of health checks:

```javascript
async function getHealthChecks() {
  try {
    return await apiClient.getChecks();
  } catch(err) {
    console.error(err);
  }
}
```

Get a certain health check:

```javascript
async function getHealthCheck(uuid) {
  try {
    return await apiClient.getCheck(uuid);
  } catch(err) {
    console.error(err);
  }
}
```

Create a new health check:

```javascript
async function createHealthCheck() {
  try {
    return await apiClient.createCheck({
      name: 'App Check',
      tags: 'prod app',
    });
  } catch(err) {
    console.error(err);
  }
}
```

## Documentation

#### `HealthChecksPingClient` Documentation:

- **`pingClient.success(payload)`** - Send a "success" ping on task completion (with optional payload) - [Healthchecks.io Documentation](https://healthchecks.io/docs/http_api/)  
- **`pingClient.fail(payload)`** - Send a "fail" ping on task failure (with optional payload) - [Healthchecks.io Documentation](https://healthchecks.io/docs/http_api/)
- **`pingClient.start()`** - Sends a "job has started!" message - [Healthchecks.io Documentation](https://healthchecks.io/docs/http_api/)  
<br />

#### `ping` Wrapper Documentation:

- **`ping(uuid, action, payload)`** - Send a "success" or "fail" ping on task completion or task failure (with optional payload) - [Healthchecks.io Documentation](https://healthchecks.io/docs/http_api/)  
<br />

#### `HealthChecksApiClient` Documentation:

- **`apiClient.getChecks(tags)`** - Gets a list of health checks - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#list-checks)  
- **`apiClient.getCheck(uuid)`** - Gets the information for a health check - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#get-check)  
- **`apiClient.createCheck(checkInfo)`** - Creates a new health check - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#create-check)  
- **`apiClient.updateCheck(uuid, checkInfo)`** - Updates an existing health check - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#update-check)  
- **`apiClient.pauseCheck(uuid)`** - Disables monitoring for a check, without removing it - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#pause-check)  
- **`apiClient.deleteCheck(uuid)`** - Permanently deletes a health check - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#delete-check)  
- **`apiClient.listPings(uuid)`** - Gets a list of pings a health check has received - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#list-pings)  
- **`apiClient.listFlips(uuid, params)`** - Gets a list of flips (status changes) a health check has experienced - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#list-flips)  
- **`apiClient.getIntegrations()`** - Gets a list of integrations - [Healthchecks.io Documentation](https://healthchecks.io/docs/api/#list-channels)  
<br />

## Change Log

The [CHANGELOG](./CHANGELOG.md) contains descriptions of notable changes.  

## License

This software is licensed under the [Apache 2 license](./LICENSE).