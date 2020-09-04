# Setup and development

- [Setup and development](#setup-and-development)
  - [First-time setup](#first-time-setup)
  - [Installation](#installation)
    - [Database](#database)
    - [Configuration](#configuration)
    - [Dev server](#dev-server)
  - [Generators](#generators)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (at least the latest LTS, currently v12)
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (at least v6.0)

Then update the following files to suit your application:

## Installation

```bash
# Install dependencies from package.json
npm install
```

> Note: don't delete package-lock.json before installation

### Database

> Note: Awesome nest boilerplate uses [TypeORM](https://github.com/typeorm/typeorm) with Data Mapper pattern.

### Configuration

Before start please install Mysql and fill correct configurations in `.env.example` file

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=user
MYSQL_PASSWORD=user
MYSQL_DATABASE=b2h_microservice_db
```

```bash
# To create new migration file
npm migration:create migration_name

# Truncate full database (note: it's not deleting the database)
npm schema:drop

# Generate migration from update of entities
npm migration:generate migration_name
```

### Dev server

> Note: If you're on Linux and see an `ENOSPC` error when running the commands below, you must [increase the number of available file watchers](https://stackoverflow.com/questions/22475849/node-js-error-enospc#answer-32600959).

```bash
# Launch the dev server
npm start:dev

# Launch the dev server and enable remote debugger
npm debug:dev
```

## Generators

This project includes generators to speed up common development tasks. Commands include:

> Note: Make sure you already have the nest-cli globally installed

```bash
# Install nest-cli globally
npm global add @nestjs/cli

# Generate a new service
nest generate service users

# Generate a new class
nest g class users

```
> Note: if you love generators then you can find full list of command in official [Nest-cli Docs](https://docs.nestjs.com/cli/usages#generate-alias-g).
