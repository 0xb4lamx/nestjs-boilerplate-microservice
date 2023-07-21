FROM node:16-alpine3.17
WORKDIR /app
COPY ./*.json ./
COPY ./ormconfig.js ./
RUN mkdir src test node_modules
COPY ./src /app/src
COPY ./test /app/test
COPY ./node_modules /app/node_modules
COPY ./.env ./
CMD ["npm","run","start:dev"]
