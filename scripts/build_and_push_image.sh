#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

NBP_BROWER_CONTAINER_NAME=xuerong/nbp-browser
NBP_SERVER_CONTAINER_NAME=xuerong/nbp-server

docker build -t ${NBP_BROWER_CONTAINER_NAME} $SCRIPT_DIR/../browser --no-cache
docker build -t ${NBP_SERVER_CONTAINER_NAME} $SCRIPT_DIR/../server_v2 --no-cache

docker push $NBP_BROWER_CONTAINER_NAME
docker push $NBP_SERVER_CONTAINER_NAME