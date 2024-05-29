module.exports = () =>`
FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf`