FROM node:18-alpine3.18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD [ "pm2-runtime","index.js" ]

