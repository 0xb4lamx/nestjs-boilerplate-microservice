#!/bin/sh
IMAGE_TAG="ms1-dev"

# ---- Env Variables ----
echo "[Loading Configuration]"
. dev/envVar.sh

# ---- setting up port ----
if [ "${PORT}" = "" ]
then
PORT=${DEFAULT_PORT}
fi

# ---- cleaning up ----
echo "[Removing Exited Containers]"
docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm

# ---- deploying network ----
echo "[Deploying Containers Network]"
echo "[Check]: Looking for already present Network"
NETWORK_PRESENT=`docker network ls | grep ${NETWORK_NAME} | wc -l`
if [ "${NETWORK_PRESENT}" -eq "0" ]
then
echo "[Check]: Network not found"
echo "[Check]: Creating ${NETWORK_NAME} network"
docker network create --driver bridge ${NETWORK_NAME} &> /dev/null
echo "[Check]: ${NETWORK_NAME} network created"
else
echo "[Check]: ${NETWORK_NAME} Network found"
echo "[Check]: Skipping creation"
fi

# ---- setting mount directories ----
echo "[Creating Data directories]"
echo "[Check]: Looking for already present Data directories"
if [ ! -d  $(pwd)/../data/mysql-data-dir ]
then
  echo "[Check]: Mysql Data directories not found"
  echo "[Check]: Creating Mysql Data directory under $(pwd)/../data/mysql-data-dir"
  mkdir -p $(pwd)/../data/mysql-data-dir
  echo "[Check]: Mysql Data directory created"
else
  echo "[Check]: Mysql Data directory found under $(pwd)/../mysql-data-dir"
  echo "[Check]: Skipping creation"
fi
if [ ! -d $HOME/eventstore-data-dir ]
then
  echo "[Check]: Eventstore Data directories not found"
  echo "[Check]: Creating Evenstore Data directory under $HOME/eventstore-data-dir"
  mkdir $HOME/eventstore-data-dir
  echo "[Check]: Eventstore Data directory created"
else
  echo "[Check]: Eventstore Data directory found under $HOME/eventstore-data-dir"
  echo "[Check]: Skipping creation"
fi

# ---- deploying mysql database ----
echo "[Check]: Looking for already running mysql ${DB_CONTANER_NAME} container"
if [ ! $(docker ps --format '{{.Names}}' | grep -w ${DB_CONTANER_NAME} &> /dev/null) ]
then
echo "[Check]: mysql ${DB_CONTANER_NAME} container not found"
echo "[Deploying Mysql Container]"
docker run  --name ${DB_CONTANER_NAME} --mount type=bind,source=$(pwd)/../data/mysql-data-dir,target=/var/lib/mysql --network ${NETWORK_NAME} -e MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD} -e MYSQL_DATABASE=${DB_ROOT_DATABASE} \
-d mysql:5.7 --character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci &> /dev/null
echo "[Deployed Mysql Container]"
else
echo "[Check]: mysql ${DB_CONTANER_NAME} container found"
echo "[Check]: Skipping mysql ${DB_CONTANER_NAME} container creation"
fi

# ---- deploying event store ----
echo "[Check]: Looking for already running Eventstore ${EVENTSTORE_CONTAINER_NAME} container"
if [ ! $(docker ps --format '{{.Names}}' | grep -w ${EVENTSTORE_CONTAINER_NAME} &> /dev/null) ]
then
echo "[Check]: Eventstore ${EVENTSTORE_CONTAINER_NAME} container not found"
echo "[Deploying Eventstore Container]"
docker run -d --name ${EVENTSTORE_CONTAINER_NAME} --mount type=bind,source=$HOME/eventstore-data-dir,target=/var/lib/eventstore --network ${NETWORK_NAME} -p ${EVENTSTORE_HTTP_PORT}:${EVENTSTORE_HTTP_PORT} -p ${EVENTSTORE_TCP_PORT}:${EVENTSTORE_TCP_PORT} \
eventstore/eventstore:release-5.0.9 &> /dev/null
echo "[Deployed Evenstore Container]"
else
echo "[Check]: Evenstore ${EVENTSTORE_CONTAINER_NAME} container found"
echo "[Check]: Skipping Evenstore ${EVENTSTORE_CONTAINER_NAME} container creation"
fi

# ---- deploying adminer ----
echo "[Check]: Looking for already running Adminer ${ADMINER_CONTAINER_NAME} container"

if [ ! $(docker ps --format '{{.Names}}' | grep -w ${ADMINER_CONTAINER_NAME} &> /dev/null) ]
then
echo "[Check]: Adminer ${ADMINER_CONTAINER_NAME} container not found"
echo "[Deploying Adminer Container]"
docker run --name ${ADMINER_CONTAINER_NAME} -d --network ${NETWORK_NAME} -p ${ADMINER_PORT}:${ADMINER_PORT} amd64/adminer:4.7.3-standalone &> /dev/null
echo "[Deployed Adminer Container]"
else
echo "[Check]: Evenstore ${ADMINER_CONTAINER_NAME} container found"
echo "[Check]: Skipping Evenstore ${ADMINER_CONTAINER_NAME} container creation"
fi

# ---- installing dependencies ----
echo "[Deploying microservice Container]"
echo "[Installing node dependencies]"
npm install ../

# ---- checking env file ----
echo "[Check]: Looking for already present .env file"
if [ ! -f $(pwd)/../.env ]
then
echo "[Check]: .env file not found"
echo "[Check]: Creating .env file"
cp $(pwd)/../.env.example $(pwd)/../.env
echo "[check]: .env file created"
else
echo "[Check]: .env file found"
echo "[Check]: skipping creation"
fi

# ---- building benjamin image ----
echo "[Building microservice image]"
DOCKER_VER=$(docker version -f '{{.Server.Version}}')
DOCKER_VER_MAJOR=$(echo "$DOCKER_VER" | cut -d'.' -f 1)
DOCKER_VER_MINOR=$(echo "$DOCKER_VER" | cut -d'.' -f 2)
if [ "$DOCKER_VER_MAJOR" -gt 18 ] || \
   { [ "$DOCKER_VER_MAJOR" -ge 18 ] && [ "$DOCKER_VER_MINOR" -ge 9 ]; }
then
    echo "Docker version >= 18.09, BUILDKIT supported"
    DOCKER_BUILDKIT=1 docker build -t ${IMAGE_TAG}  -f dev/Dockerfile ..
else
    echo "Docker version < 18.09, BUILDKIT NOT supported"
    docker build -t ${IMAGE_TAG}  -f dev/Dockerfile ..
fi

# ---- deploying benjamin container ----
echo "[Deploying microservice Container]"
docker run -p ${PORT}:${PORT} -p ${DEBUG_PORT}:${DEBUG_PORT} --name ${CONTAINER_NAME} \
--mount type=bind,source="$(pwd)"/../src,target=/app/src \
--mount type=bind,source="$(pwd)"/../test,target=/app/test \
--mount type=bind,source="$(pwd)"/../docs,target=/app/docs \
--mount type=bind,source="$(pwd)"/../node_modules,target=/app/node_modules \
-e MYSQL_HOST=${DB_CONTANER_NAME} -e EVENT_STORE_HOSTNAME=${EVENTSTORE_CONTAINER_NAME} \
-e MYSQL_USERNAME=${DB_ROOT_USERNAME} -e MYSQL_PASSWORD=${DB_ROOT_PASSWORD} \
-e MYSQL_DATABASE=${DB_ROOT_DATABASE} -e MYSQL_PORT=${DB_MYSQL_PORT} \
-e EVENT_STORE_CREDENTIALS_USERNAME=${EVENSTORE_USERNAME} -e EVENT_STORE_CREDENTIALS_PASSWORD=${EVENTSTORE_PASSWORD} \
-e EVENT_STORE_PROTOCOL=${EVENTSTORE_PROTOCOL} \
-e EVENT_STORE_TCP_PORT=${EVENTSTORE_TCP_PORT} -e EVENT_STORE_HTTP_PORT=${EVENTSTORE_HTTP_PORT} \
-e EVENT_STORE_POOLOPTIONS_MIN=${EVENTSTORE_POOLOPTIONS_MIN} -e EVENT_STORE_POOLOPTIONS_MAX=${EVENTSTORE_POOLOPTIONS_MAX} \
-e PORT=${PORT} -e HOST=${HOST} \
--network ${NETWORK_NAME}  ${IMAGE_TAG}
