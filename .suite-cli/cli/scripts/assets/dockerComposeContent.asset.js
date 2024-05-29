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
      - ../../../microservices/${service.name}:/app`).join('');

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
  `;
};