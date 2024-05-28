module.exports = ({ services }) => {
    const upstreams = services.map(service => `
  upstream ${service.name.toLowerCase().replace(/\s+/g, '-')}_upstream {
      server ${service.name.toLowerCase().replace(/\s+/g, '-')}:${service.port};
  }`).join('\n');

    const serverBlocks = services.map(service => `
      location /${service.name.toLowerCase().replace(/\s+/g, '-')}/ {
          proxy_pass http://${service.name.toLowerCase().replace(/\s+/g, '-')}_upstream;
      }`).join('\n');

    return `http {
  ${upstreams}
  
      server {
          listen 80;
  
  ${serverBlocks}
      }
  }`;
};  