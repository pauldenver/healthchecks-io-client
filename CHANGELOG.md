## <span>Healthchecks</span>&#46;io API Client Changelog

## v1.0.4

### Minor changes

*  Updated Axios dependency to v0.21.1 to address a security vulnerability ([CVE-2020-28168](https://nvd.nist.gov/vuln/detail/CVE-2020-28168)).
*  Updated module dependencies to their current versions.
*  Added the `maxBodyLength` option to the `HealthChecksApiClient` client, which sets the maximum allowed size of the HTTP request body in bytes.
*  Added the `listPings` and `listFlips` methods to the `HealthChecksApiClient` class, which allow requests to the `Pings` and `Flips` endpoints.

### Breaking changes

*  Removed support for Node.js versions less than v10.12.0.  

## v1.0.3

### Minor changes

*  Updated documentation.

## v1.0.2

### Minor changes

*  Added a shorthand version (wrapper) for `HealthChecksPingClient` pings.

## v1.0.1

### Minor changes

*  Added input validation using `Joi`.

## v1.0.0

*  Initial <span>Healthchecks</span>&#46;io Client library release.