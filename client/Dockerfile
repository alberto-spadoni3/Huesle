FROM node:16.17.0-alpine3.15

WORKDIR /usr/huesle-client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build; \
    npm install -g serve;

CMD [ "serve", "-s", "build" ]
