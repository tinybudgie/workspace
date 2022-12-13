#!/bin/bash
export CURRENT_UID=$(id -u):$(id -g)

docker volume create --name=nx-postgres-volume --label=nx-postgres-volume

# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d nx-postgres

# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=nx-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres to start up"
    sleep 2
done

# Build app
npx nx build

# Run migrations
npx prisma migrate deploy

# Start all services
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d