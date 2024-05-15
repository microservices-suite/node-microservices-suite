module.exports = ({ services }) => `
${services.map(({ service, port }) => `
upstream ${service} {
    server ${service}:${port};
}`).join('')}

server {
    listen 80;

${services.map(({ service }) => `
    location /${service} {
        rewrite /${service}/(.*) /$1 break;
        proxy_pass http://${service};
    }`).join('')}
}
`.trim();
