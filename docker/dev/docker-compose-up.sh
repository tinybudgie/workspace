#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=nxnest-postgres-volume --label=nxnest-postgres-volume
# Start only database
docker-compose -f ./docker/docker-compose.yml --compatibility up -d nxnest-postgres
# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=nxnest-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done

# TODO: add db create and migration run

# Start all services
docker-compose -f ./docker/docker-compose.yml --compatibility up -d