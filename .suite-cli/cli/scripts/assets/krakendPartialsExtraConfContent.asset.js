module.exports = ({ app_name }) => `
{
    "security/cors": {
      "allow_origins": [
        "*"
      ],
      "allow_methods": [
        "POST",
        "GET"
      ],
      "allow_headers": [
        "Origin",
        "Authorization",
        "Content-Type"
      ],
      "expose_headers": [
        "Content-Length"
      ],
      "max_age": "12h"
    },
    "telemetry/gelf": {
      "address": "logstash:12201"
    },
    "telemetry/logging": {
      "level": "DEBUG",
      "prefix": "[SUITE]",
      "syslog": false,
      "stdout": true
    },
    "telemetry/metrics": {
      "collection_time": "60s",
      "listen_address": ":8090"
    },
    "telemetry/influx": {
      "address": "http://influxdb:8086",
      "ttl": "25s",
      "buffer_size": 0,
      "username": "krakend-dev",
      "password": "pas5w0rd"
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
          "serviceName": "🦧${app_name}"
        }
      }
    }
}
`