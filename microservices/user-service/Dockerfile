FROM node:18-alpine3.18

WORKDIR /app

COPY package.json .

RUN yarn install

RUN yarn global add pm2

COPY . .

CMD [ "yarn","start"]
