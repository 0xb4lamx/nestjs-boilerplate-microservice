# ---- Base Node ----
FROM node:carbon AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY ./package*.json ./
RUN npm install 

# ---- Build ----
FROM dependencies AS build
WORKDIR /app
RUN mkdir src docs test
COPY ./src /app/src
COPY ./docs /app/docs
COPY ./test /app/test
COPY ./ts*.json ./
COPY ./ormconfig.js ./
RUN npm run build 

# --- Release with Alpine ----
FROM node:12.8-alpine AS release
WORKDIR /app
RUN mkdir node_modules dist
COPY --from=dependencies app/node_modules node_modules/
COPY --from=dependencies app/package*.json ./
COPY --from=build app/dist dist/
COPY --from=build app/ormconfig.js ./
CMD ["npm","run","start:prod"]