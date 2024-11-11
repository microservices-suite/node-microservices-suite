module.exports = ({ services, webserver, krakend_port, env }) => {
  const servicesConfig = services.map(service => `
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
`).join('');

  // Collect all service names for the 'depends_on' section of the web server
  const serviceNames = services.map(service => service.name.toLowerCase().replace(/\s+/g, '-'));

  return `
version: '3.8'
services:
${servicesConfig}
  ${webserver.toLowerCase().replace(/\s+/g, '-') || 'webserver'}:
    depends_on:
${serviceNames.map(service => `      - ${service}`).join('\n')}
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
  rabbitmq:
    image: rabbitmq:3.13-management
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      retries: 5
  mongodb:
    image: mongo
    ports:
      - '27017:27017'
    restart: always
    volumes:
      - type: bind
        source: ./data
        target: /data/db
  krakend:
    image: devopsfaith/krakend:2.7${env === 'dev' ? '-watch' : ''}
    ports:
      - '${krakend_port}:${krakend_port}'
      - '8090:8090'
    volumes:
      - ./krakend/:/etc/krakend/
    command: ['run','-d','-c','/etc/krakend/krakend.json']
  grafana:
    image: grafana/grafana:9.1.2
    ports:
      - "3000:3000"
    volumes:
      - "./sre/grafana/datasources/all.yml:/etc/grafana/provisioning/datasources/all.yml"
      - "./sre/grafana/dashboards/all.yml:/etc/grafana/provisioning/dashboards/all.yml"
      - "./sre/grafana/krakend:/var/lib/grafana/dashboards/krakend"
  influxdb:
    image: influxdb:1.8.10
    environment:
      - "INFLUXDB_DB=krakend"
      - "INFLUXDB_USER=krakend-dev"
      - "INFLUXDB_USER_PASSWORD=pas5w0rd"
      - "INFLUXDB_ADMIN_USER=admin"
      - "INFLUXDB_ADMIN_PASSWORD=supersecretpassword"
    ports:
      - "8086:8086"
  jaeger:
    image: jaegertracing/all-in-one:1
    ports:
      - "16686:16686"
      - "14268:14268"
  elasticsearch:
    image: elasticsearch:8.4.1
    environment:
      - "discovery.type=single-node"
      - "xpack.security.enabled=false"
      - "xpack.security.transport.ssl.enabled=false"
      - "xpack.security.http.ssl.enabled=false"
      - "ES_JAVA_OPTS=-Xms1024m -Xmx1024m"
    ports:
      - "19200:9200"
      - "9300:9300"
  kibana:
    image: kibana:8.4.1
    ports:
      - "5601:5601"
  logstash:
    image: logstash:8.4.1
    ports:
      - "12201:12201/udp"
      - "5044:5044"
    environment:
      - "xpack.monitoring.elasticsearch.url=http://elasticsearch:9200"
    volumes:
      - ./sre/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    command: ["-f", "/usr/share/logstash/pipeline/logstash.conf"]`;
};