#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g) 
docker-compose -f ./docker/docker-compose.yml down