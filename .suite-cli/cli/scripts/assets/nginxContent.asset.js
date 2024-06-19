module.exports = ({ services }) => {
  const upstreams = services.map(service => `
upstream ${service.name.toLowerCase().replace(/\s+/g, '-')}_upstream {
  server ${service.name.toLowerCase().replace(/\s+/g, '-')}:${service.port};
}`).join('\n');

  const serverBlocks = services.map(service => `
  location /api/v1/${service.name.toLowerCase().replace(/\s+/g, '-')}s {
      proxy_pass http://${service.name.toLowerCase().replace(/\s+/g, '-')}_upstream;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }`).join('\n');

  return `
${upstreams}

server {
  listen 80;

${serverBlocks}
}`;
};