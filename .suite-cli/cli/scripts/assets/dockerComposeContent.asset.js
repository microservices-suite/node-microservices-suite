module.exports = ({ services }) => `
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - '27017:27017'
  rabbitmq:
    image: rabbitmq:3.8
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
${services.map(({ service, ports, prerequisites }) => `
  ${service}:
    depends_on:
${prerequisites.map((prerequisite) => `      - ${prerequisite}`).join('\n')}
    container_name: ${service}
    restart: always
    build:
      context: ../../../microservices/${service}
      dockerfile: DockerFile.dev
    ports:
${ports.map((p) => `      - '${p}:${p}'`).join('\n')}
    volumes:
      - /app/node_modules
      - ../../../microservices/${service}:/app`).join('\n')}
`.trim();
