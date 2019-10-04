
## Description

Microservice boilerplate based on [Nest](https://github.com/nestjs/nest), a framework TypeScript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. This project cover both, running on a containerized environment using Docker, or on your local machine.  

## Setup

### Docker Environment
This section will cover the steps to follow for a containerized version of this project.

### Prerequisites
* A [Docker](https://docs.docker.com/) engine running on your local machine. Reffer to [official documentation](https://docs.docker.com/install/) for intructions.
 
### Installation

```bash
cd scripts && sudo sh build.sh
```
*The build script Will:*
* Create private network for containers.
* Configure and deploy MYSQL container.
* Configure and deploy EventStore container.
* Configure and deploy nestjs-boilerplate container.
* Connect containers to private network.
* Enables hot-reloading by mounting working directories inside nestjs-boilerplate container. 

### Usage
- To access the App home page navigate to http://localhost:3000  [DEFAULT PORT].
- To access the EventStore Admin UI navigate to http://localhost:2113 [DEFAULT PORT].
- To login to the EventStore use the following *credentials*: user: admin | password: changeit [DEFAULT CREDENTIALS].
- To change default setting, edit script/dev/evVAr.sh

### local Environment
This section will cover the steps to follow for a local version of this project.

### Prerequisites
* A running EventStore. Reffer to [official documentation](https://eventstore.org/docs/getting-started/index.html?tabs=tabid-1) for intructions.
* A running Mysql Server. Reffer to [official documentation](https://dev.mysql.com/doc/refman/5.7/en/) for intructions.
* A running Node Server. Reffer to [official documentation](https://nodejs.org/en/download/) for intructions.
* [npm](https://www.npmjs.com)

**PS**: in order to start receiving events from the **EventStore**, you should [enable projections](https://eventstore.org/docs/projections/system-projections/index.html?tabs=tabid-5#enabling-system-projections). (disabled by default)
### Installation

```bash
$ npm install
```
### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Built With

* [Docker](https://docs.docker.com/) - Containerization technology
* [npm](https://www.npmjs.com) - Dependency Management
* [Nest](https://github.com/nestjs/nest)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
