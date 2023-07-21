#!/bin/sh
export NETWORK_NAME="alpine-net"
# ---- MYSQL PARAMS ----
export DB_CONTANER_NAME="sql-db"
export DB_ROOT_PASSWORD="root"
export DB_ROOT_USERNAME="root"
export DB_ROOT_DATABASE="demo-db"
export DB_MYSQL_PORT="3306"
# ---- MS1 PARAMS ----
export CONTAINER_NAME="devtest"
export DEFAULT_PORT="3000"
export PORT=""
export DEBUG_PORT="9229"
export HOST="0.0.0.0"
# ---- EVENSTORE PARAMS ----
export EVENTSTORE_CONTAINER_NAME="eventstore"
export EVENTSTORE_PROTOCOL="http"
export EVENTSTORE_TCP_PORT="1113"
export EVENTSTORE_HTTP_PORT="2113"
export EVENSTORE_USERNAME="admin"
export EVENTSTORE_PASSWORD="changeit"
export EVENTSTORE_POOLOPTIONS_MIN="1"
export EVENTSTORE_POOLOPTIONS_MAX="10"
# ---- Adminer PARAMS ----
export ADMINER_CONTAINER_NAME="adminer"
export ADMINER_PORT="8080"
