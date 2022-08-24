FROM node:16.17.0-alpine3.15

WORKDIR /usr/huesle-server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080 8081

CMD [ "node", "index.js" ]
