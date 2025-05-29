export DOCKER_REGISTRY=mx-queretaro-1.ocir.io/axe7rjmbgq9x/reacttodo/c0wwpexport DOCKER_REGISTRY=mx-queretaro-1.ocir.io/axe7rjmbgq9x/reacttodo/c0wwp#!/bin/bash

export IMAGE_NAME=todolistapp-springboot
export IMAGE_VERSION=0.1


if [ -z "$DOCKER_REGISTRY" ]; then
    export DOCKER_REGISTRY=mx-queretaro-1.ocir.io/axe7rjmbgq9x/reacttodo/c0wwp
    echo "DOCKER_REGISTRY set."
fi
if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    exit 1
fi

export IMAGE=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}

mvn clean package spring-boot:repackage
docker build -f Dockerfile -t $IMAGE .

docker push $IMAGE
if [  $? -eq 0 ]; then
    docker rmi "$IMAGE" #local
fi