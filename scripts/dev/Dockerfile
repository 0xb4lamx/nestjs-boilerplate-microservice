FROM node:carbon
WORKDIR /app
COPY ./*.json ./
RUN npm install
RUN mkdir src
COPY ./src /app/src
RUN mkdir test
COPY ./test /app/test
RUN mkdir docs
CMD ["npm","run","start:dev"]
