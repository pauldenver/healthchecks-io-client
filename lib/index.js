const { HealthChecksPingClient, ping } = require('./healthchecks_ping_client');
const HealthChecksApiClient = require('./healthchecks_api_client');

module.exports = {
  ping,
  HealthChecksPingClient,
  HealthChecksApiClient,
};
