#!/bin/bash
export CURRENT_UID=$(id -u):$(id -g)

docker volume create --name=nxnestjs-postgres-volume --label=nxnestjs-postgres-volume

# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d nxnestjs-postgres

# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=nxnestjs-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres to start up"
    sleep 2
done

# Build app
npx nx build

# Run migrations
npx prisma migrate deploy

# Start all services
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d