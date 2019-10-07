#!bin/sh
NETWORK_PRESENT=`docker network ls | grep ${NETWORK_NAME} | wc -l`
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
echo "[Creating Data directories"
echo "[Check]: Looking for already present Data directories"
if [ ! -f  $HOME/mysql-data-dir ] 
then
  echo "[Check]: Mysql Data directories not found"
  echo "[Check]: Creating Mysql Data directory under $HOME/mysql-data-dir"
  mkdir $HOME/mysql-data-dir 
  chown $USER:$USER $HOME/mysql-data-dir
  echo "[Check]: Mysql Data directory created"
else
  echo "[Check]: Mysql Data directory found under $HOME/mysql-data-dir"
  echo "[Check]: Skipping creation"
fi 
if [ ! -f $HOME/eventstore-data-dir ]
then
  echo "[Check]: Eventstore Data directories not found"
  echo "[Check]: Creating Evenstore Data directory under $HOME/eventstore-data-dir"
  mkdir $HOME/eventstore-data-dir
  chown $USER:$USER $HOME/eventstore-data-dir
  echo "[Check]: Eventstore Data directory created"
else
  echo "[Check]: Eventstore Data directory found under $HOME/eventstore-data-dir"
  echo "[Check]: Skipping creation"
fi

# ---- deploying mysql database ----
echo "[Deploying Mysql Container]"
docker run  --name ${DB_CONTANER_NAME} --mount type=bind,source=$HOME/mysql-data-dir,target=/var/lib/mysql --network ${NETWORK_NAME} -e MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD} -e MYSQL_DATABASE=${DB_ROOT_DATABASE} \
-d mysql:5.7 --character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci &> /dev/null
echo "[Deployed Mysql Container]"

# ---- deploying event store ----
echo "[Deploying Evenstore Container]"
docker run -d --name ${EVENTSTORE_CONTAINER_NAME} --mount type=bind,source=$HOME/eventstore-data-dir,target=/var/lib/eventstore --network ${NETWORK_NAME} -p ${EVENTSTORE_HTTP_PORT}:${EVENTSTORE_HTTP_PORT} -p ${EVENTSTORE_TCP_PORT}:${EVENTSTORE_TCP_PORT} \
eventstore/eventstore &> /dev/null
echo "[Deployed Evenstore Container]"

# ---- deploying adminer ----
echo "[Deploying Adminer Container]"
docker run --name ${ADMINER_CONTAINER_NAME} -d --network ${NETWORK_NAME} -p ${ADMINER_PORT}:${ADMINER_PORT} amd64/adminer:4.7.3-standalone &> /dev/null
echo "[Deployed Adminer Container]"

# ---- installing dependencies ----
echo "[Deploying microservice Container]"
echo "[Installing node dependencies]"
npm install ../

# ---- building benjamin image ----
echo "[Building microservice image]"
docker build -t ${IMAGE_TAG}  -f dev/Dockerfile .. 

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
