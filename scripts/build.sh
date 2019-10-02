#!bin/sh
NETWORK_PRESENT=`docker network ls | grep ${NETWORK_NAME} | wc -l`
IMAGE_TAG="ms1-dev"

# ---- Env Variables ----
. dev/envVar.sh

# ---- setting up port ----
if [ "${PORT}" = "" ]
then
PORT=${DEFAULT_PORT}
fi

# ---- cleaning up ----
docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm
docker image rm ${IMAGE_TAG} -f

# ---- deploying network ----
if [ "${NETWORK_PRESENT}" -eq "0" ]
then 
docker network create --driver bridge ${NETWORK_NAME}
fi

# ---- deploying mysql database ----
docker run  --name ${DB_CONTANER_NAME} --network ${NETWORK_NAME} -e MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD} -e MYSQL_DATABASE=${DB_ROOT_DATABASE} \
-d mysql:5.7 --character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci

# ---- deploying event store ----
docker run -d --name ${EVENTSTORE_CONTAINER_NAME} --network ${NETWORK_NAME} -p ${EVENTSTORE_HTTP_PORT}:${EVENTSTORE_HTTP_PORT} -p ${EVENTSTORE_TCP_PORT}:${EVENTSTORE_TCP_PORT} \
eventstore/eventstore  

# ---- building benjamin image ----
docker build -t ${IMAGE_TAG}  -f dev/Dockerfile .. 

# ---- deploying benjamin container ----
docker run -p ${PORT}:${PORT} -p ${DEBUG_PORT}:${DEBUG_PORT} --name ${CONTAINER_NAME} \
--mount type=bind,source="$(pwd)"/../src,target=/app/src \
--mount type=bind,source="$(pwd)"/../test,target=/app/test \
--mount type=bind,source="$(pwd)"/../docs,target=/app/docs \
-e MYSQL_HOST=${DB_CONTANER_NAME} -e EVENT_STORE_HOSTNAME=${EVENTSTORE_CONTAINER_NAME} \
-e MYSQL_USERNAME=${DB_ROOT_USERNAME} -e MYSQL_PASSWORD=${DB_ROOT_PASSWORD} \
-e MYSQL_DATABASE=${DB_ROOT_DATABASE} -e MYSQL_PORT=${DB_MYSQL_PORT} \
-e EVENT_STORE_CREDENTIALS_USERNAME=${EVENSTORE_USERNAME} -e EVENT_STORE_CREDENTIALS_PASSWORD=${EVENTSTORE_PASSWORD} \
-e EVENT_STORE_PROTOCOL=${EVENTSTORE_PROTOCOL} \
-e EVENT_STORE_TCP_PORT=${EVENTSTORE_TCP_PORT} -e EVENT_STORE_HTTP_PORT=${EVENTSTORE_HTTP_PORT} \
-e EVENT_STORE_POOLOPTIONS_MIN=${EVENTSTORE_POOLOPTIONS_MIN} -e EVENT_STORE_POOLOPTIONS_MAX=${EVENTSTORE_POOLOPTIONS_MAX} \
-e PORT=${PORT} -e HOST=${HOST} \
--network ${NETWORK_NAME}  ${IMAGE_TAG}
