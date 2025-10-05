module.exports = ({
  services,
  projectName,
  api_version,
  gateway_cache_period,
  gateway_timeout,
  gateway_port,
  app_name
}) => {
  // Health check for all services
  const suiteStatusCheckBackends = services.map((service) => `
    {
      "host": ["http://${service.name.toLowerCase()}:${service.port}"],
      "url_pattern": "/",
      "mapping": {
        "message": "${service.name.toLowerCase()}"
      }
    }`).join(',\n');

  // List all services
  const allServicesListBackends = services.map((service) => `
    {
      "host": ["http://${service.name.toLowerCase()}:${service.port}"],
      "url_pattern": "/api/${api_version}/${service.name.toLowerCase()}s",
      "mapping": {
        "data": "${service.name.toLowerCase()}s"
      }
    }`).join(',\n');

  // Each service backend
  const eachServiceListBackends = [services[0]].map((service) => `
    {
      "host": ["http://${service.name.toLowerCase()}:${service.port}"],
      "url_pattern": "/api/${api_version}/${service.name.toLowerCase()}s",
      "mapping": {
        "data": "${service.name.toLowerCase()}s"
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
      "@comment": "Fetch all data from the ${services[0].name.toLowerCase()} service",
      "endpoint": "/api/${api_version}/${services[0].name.toLowerCase()}s",
      "method": "GET",
      "backend": [${eachServiceListBackends}]
    }
  ],
   "extra_config": {
    "telemetry/metrics": {
        "collection_time": "30s",
        "listen_address": ":8090"
    },
    "telemetry/influx": {
        "address": "http://influxdb:8086",
        "ttl": "25s",
        "buffer_size": 100,
        "username": "krakend-dev",
        "password": "pas5w0rd"
    },
    "telemetry/logging": {
        "level": "DEBUG",
        "prefix": "[SUITE]",
        "syslog": false,
        "stdout": true
    },
    "telemetry/gelf": {
        "address": "logstash:12201",
        "enable_tcp": false
    },
    "telemetry/opencensus": {
        "sample_rate": 100,
        "reporting_period": 1,
        "enabled_layers": {
            "backend": true,
            "router": true
        },
        "exporters": {
            "jaeger": {
                "endpoint": "http://jaeger:14268/api/traces",
                "service_name": "🦧${app_name}"
            }
        }
    }
  }
}`;
};
