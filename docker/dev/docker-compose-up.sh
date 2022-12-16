#!/bin/bash
export CURRENT_UID=$(id -u):$(id -g)

# extract the protocol
proto="`echo $DATABASE_URL | grep '://' | sed -e's,^\(.*://\).*,\1,g'`"
# remove the protocol
url=`echo $DATABASE_URL | sed -e s,$proto,,g`

# extract the user and password (if any)
userpass="`echo $url | grep @ | cut -d@ -f1`"
pass=`echo $userpass | grep : | cut -d: -f2`
if [ -n "$pass" ]; then
    user=`echo $userpass | grep : | cut -d: -f1`
else
    user=$userpass
fi

database=`echo $url | sed -e s,$userpass@$hostport/,,g | cut -d? -f1`

export POSTGRES_USER=$user
export POSTGRES_PASSWORD=$pass
export POSTGRES_DB=$database

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
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up