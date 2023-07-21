
## Description

Microservice boilerplate based on [NestJS v10](https://github.com/nestjs/nest), built with TypeScript.
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. This project cover both, running on a containerized environment using Docker, or on your local machine.

[Guidelines](docs/guidelines.md#guidelines)

## Setup

### Docker Environment
This section will cover the steps to follow for a containerized version of this project.

### Prerequisites
* A [Docker](https://docs.docker.com/) engine running on your local machine. Reffer to [official documentation](https://docs.docker.com/install/) for intructions.
* Post-installation steps for Linux. Reffer to [official documentation](https://docs.docker.com/install/linux/linux-postinstall/) for intructions.
 
### Installation

```bash
(cd scripts/ && sh build.sh)
```
*The build script Will:*
* Create private network for containers.
* Configure and deploy MYSQL container.
* Configure and deploy Adminer container.
* Configure and deploy EventStore container.
* Configure and deploy nestjs-boilerplate container.
* Connect containers to private network.
* Enables hot-reloading by mounting working directories inside nestjs-boilerplate container. 
* Create and mount data directory to mysql container for persistence under $HOME/mysql-data-dir.
* Create and mount data directory to EventStore container for persistence under $HOME/eventstore-data-dir.

### Usage
- To access the App home page navigate to http://localhost:3000  [DEFAULT PORT].
- To access the EventStore Admin UI navigate to http://localhost:2113 [DEFAULT PORT].
- To access the Adminer UI navigate to http://localhost:8080 [DEFAULT PORT].
- To change default setting, edit script/dev/evVAr.sh

### Access
- **EventStore**: 
  - **credentials**: 
  
    |User|Password|
    |--|--|
    |admin|changeit|
- **Adminer**
  - **Form**
  
    |Server|User|Password|Database
    |--|--|--|--|
    |sql-db|root|root|demo-db|
- **Microservice Docker Container**
    ```bash
        sudo docker exec -it devtest bash
    ```
### Clean up
**Soft clean up**
```bash
(cd scripts/ && sudo sh cleanup.sh)
```

*The cleanup script soft Will:*
* Remove private network.
* Stop and remove MYSQL container.
* Stop and remove Adminer container.
* Stop and remove EventStore container.


**Hard clean up**
```bash
#both commands are equivalent
#option1 
(cd scripts/ && sudo sh cleanup.sh -h)
#option2
(cd scripts/ && sudo sh cleanup.sh --hard)
```
*The cleanup script hard Will:*
* Remove private network.
* Stop and remove MYSQL container.
* Stop and remove Adminer container.
* Stop and remove EventStore container.
* Delete Mysql data directory.
* Delete EventStore data directory.


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

### Database setup
* using TypeORM CLI. Reffer to [migration documentation](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations) for intructions.

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

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

## Future Goals

Add tests;

## Contributing

You are welcome to contribute to this project, just open a PR.

## License

 [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
