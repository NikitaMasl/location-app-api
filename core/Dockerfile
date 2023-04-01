FROM node:18-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]
