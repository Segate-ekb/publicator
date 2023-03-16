#!/bin/bash
set -e

docker login -u $DOCKER_LOGIN -p $DOCKER_PASSWORD $DOCKER_USERNAME

if [ $DOCKER_SYSTEM_PRUNE = 'true' ] ; then
    docker system prune -af
fi

last_arg='.'
if [ $NO_CACHE = 'true' ] ; then
    last_arg='--no-cache .'
fi

docker build \
    --pull \
    --build-arg ONEC_USERNAME=$ONEC_USERNAME \
    --build-arg ONEC_PASSWORD=$ONEC_PASSWORD \
    --build-arg ONEC_VERSION=$ONEC_VERSION \
    --build-arg DOCKER_USERNAME=$DOCKER_USERNAME \
    -t $DOCKER_USERNAME/publicator:$ONEC_VERSION \
    -f webserver/Dockerfile \
    $last_arg

docker push $DOCKER_USERNAME/publicator:$ONEC_VERSION
