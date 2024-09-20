module.exports = ({
  services,
  projectName,
  api_version,
  gateway_cache_period,
  gateway_timeout,
  gateway_port
}) => {
  // Health check for all services
  const suiteStatusCheckBackends = services.map((service) => `
    {
      "host": ["http://${service.toLowerCase()}:${service.port}"],
      "url_pattern": "/",
      "mapping": {
        "message": "${service.toLowerCase()}"
      }
    }`).join(',\n');

  // List all services
  const allServicesListBackends = services.map((service) => `
    {
      "host": ["http://${service.toLowerCase()}:${service.port}"],
      "url_pattern": "/api/${api_version}/${service.toLowerCase()}s",
      "mapping": {
        "data": "${service.toLowerCase()}s"
      }
    }`).join(',\n');

  // Each service backend
  const eachServiceListBackends = [services[0]].map((service) => `
    {
      "host": ["http://${service.toLowerCase()}:${service.port}"],
      "url_pattern": "/api/${api_version}/${service.toLowerCase()}s",
      "mapping": {
        "data": "${service.toLowerCase()}s"
      }
    }`).join(',\n');

  // The JSON result string
  return `
{
  "$schema": "https://www.krakend.io/schema/v2.5/krakend.json",
  "version": 3,
  "name": "${projectName.charAt(0).toUpperCase() + projectName.slice(1)} API Gateway",
  "port": ${gateway_port},
  "cache_ttl": "${gateway_cache_period}s",
  "timeout": "${gateway_timeout}s",
  "endpoints": [
    {
      "@comment": "Check the health of all your APIs",
      "endpoint": "/__suite_status",
      "method": "GET",
      "backend": [${suiteStatusCheckBackends}]
    },
    {
      "@comment": "Hit all API list endpoints simultaneously",
      "endpoint": "/api/${api_version}/",
      "method": "GET",
      "backend": [${allServicesListBackends}]
    },
    {
      "@comment": "Fetch all data from the ${services[0].toLowerCase()} service",
      "endpoint": "/api/${api_version}/${services[0].toLowerCase()}s",
      "method": "GET",
      "backend": [${eachServiceListBackends}]
    }
  ]
}`;
};
