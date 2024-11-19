module.exports = ({ services, webserver, krakend_port, env }) => {
  const servicesConfig = services
    .map(
      (service) => `
  ${service.name.toLowerCase().replace(/\s+/g, '-')}: 
    build: 
      dockerfile: Dockerfile.dev 
      context: ../../../microservices/${service.name} 
    ports: 
      - "${service.port}:${service.port}" 
    volumes: 
      - /app/node_modules 
      - ../../../microservices/${service.name}:/app 
    depends_on:
      rabbitmq:
        condition: service_healthy
`
    )
    .join('');

  const serviceNames = services.map((service) =>
    service.name.toLowerCase().replace(/\s+/g, '-')
  );

  return `
version: '3.8'

services:
${servicesConfig}
  ${webserver.toLowerCase().replace(/\s+/g, '-') || 'webserver'}:
    depends_on:
${serviceNames.map((service) => `      - ${service}`).join('\n')}
    restart: always
    build:
      context: ./${webserver}
      dockerfile: Dockerfile.dev
    ports:
      - '4000:80'
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:80/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  krakend:
    image: devopsfaith/krakend:\${KRAKEND_VERSION}${env === 'dev' ? '-watch' : ''}
    ports:
      - '${krakend_port}:${krakend_port}'
      - '8090:8090'
    volumes:
      - ./telemetry/krakend/:/etc/krakend/
    command: ['run', '-d', '-c', '/etc/krakend/krakend.json']

  rabbitmq:
    image: rabbitmq:\${RABBITMQ_VERSION}
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      retries: 5

  mongodb:
    image: mongo:\${MONGODB_VERSION}
    ports:
      - '27017:27017'
    restart: always
    volumes:
      - type: bind
        source: ./data
        target: /data/db

  influxdb:
    image: influxdb:\${INFLUXDB_VERSION}
    environment:
      - "INFLUXDB_DB=krakend"
      - "INFLUXDB_USER=krakend-dev"
      - "INFLUXDB_USER_PASSWORD=pas5w0rd"
      - "INFLUXDB_ADMIN_USER=admin"
      - "INFLUXDB_ADMIN_PASSWORD=supersecretpassword"
    ports:
      - "8086:8086"
        
  grafana:
    image: grafana/grafana:\${GRAFANA_VERSION}
    ports:
      - "3000:3000"
    volumes:
      - "./telemetry/grafana/datasources/all.yaml:/etc/grafana/provisioning/datasources/all.yaml"
      - "./telemetry/grafana/dashboards/all.yaml:/etc/grafana/provisioning/dashboards/all.yaml"
      - "./telemetry/grafana/krakend:/var/lib/grafana/dashboards/krakend"

  jaeger:
    image: jaegertracing/all-in-one:\${JAEGER_VERSION}
    ports:
      - "16686:16686"
      - "14268:14268"

  elasticsearch:
    image: elasticsearch:\${ELK_VERSION}
    container_name: elasticsearch
    ports:
      - "19200:9200"
      - "9300:9300"
    environment:
      - "discovery.type=single-node"
      - "xpack.security.enabled=false"
      - "xpack.security.transport.ssl.enabled=false"
      - "xpack.security.http.ssl.enabled=false"
      - "ES_JAVA_OPTS=-Xms\${ELASTIC_SEARCH_HEAP_INIT} -Xmx\${ELASTIC_SEARCH_HEAP_MAX}"
  logstash:
    image: logstash:\${ELK_VERSION}
    container_name: logstash
    ports:
      - "12201:12201/udp"
      - "5044:5044"
    environment:
      - "xpack.monitoring.elasticsearch.url=http://elasticsearch:9200"
    volumes:
      - ./telemetry/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    command: ["-f", "/usr/share/logstash/pipeline/logstash.conf"]
    
  kibana:
    image: kibana:\${ELK_VERSION}
    container_name: kibana
    ports:
      - "5601:5601"
  `;
};
