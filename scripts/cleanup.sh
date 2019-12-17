#!/bin/sh

# ---- Env Variables ----
. dev/envVar.sh

# ---- removing containers ----
echo "[Stoping And Deleting Containers]"
for i in ${DB_CONTANER_NAME} ${EVENTSTORE_CONTAINER_NAME} ${ADMINER_CONTAINER_NAME} ${CONTAINER_NAME}
do
echo -n "[Delted]: "
docker container rm $i -f
done

# ---- removing dangling images ----
echo "[Deleting Dangling Images] \n"
echo -n "[Delted]: "
docker image prune -f

# ---- removing network ----
echo "[Deleting ${NETWORK_NAME} Network] \n"
echo -n "[Delted]: "
docker network rm ${NETWORK_NAME}

# ---- purge persistent data ----
echo "\n[Deleting Data Directories]"
while [ "$1" != "" ]
do
    case $1 in
        -h | --hard)
            rm -rf $HOME/eventstore-data-dir
            echo "[Delted]: eventstore data directory"
            rm -rf $(pwd)/../data
            echo "[Delted]: mysql data directory"
            exit
        ;;
        *)
            echo "[Error]: Invalid argument"
            exit
        ;;
    esac
done
