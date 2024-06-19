module.exports = ({ services, webserver }) => {
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
    image: rabbitmq:3.13.3
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
        target: /data/db`;
};
