# ---- Base Node ----
FROM node:lts-alpine3.9 AS base
RUN apk add --no-cache git
WORKDIR /app
RUN chown -R node:node /app
USER node

# ---- Dependencies ----
FROM base AS dependencies
COPY ./package*.json ./
RUN npm install -d

# ---- Build ----
FROM dependencies AS build
WORKDIR /app
COPY ./src /app/src
COPY ./ts*.json ./
COPY ormconfig.js ./
RUN npm run build

# ---- Polishing ----
FROM base AS polishing
COPY ./package*.json ./
RUN npm install --production -d

# --- Release with distroless ----
FROM gcr.io/distroless/nodejs:12 AS release
WORKDIR /app
COPY --from=polishing app/node_modules node_modules/
COPY --from=build app/dist dist/
COPY --from=build app/ormconfig.js ./
USER nonroot
CMD ["dist/src/main.js"]