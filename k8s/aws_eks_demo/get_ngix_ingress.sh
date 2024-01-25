#!/usr/bin/env bash

CHART_VERSION="4.9.0"
APP_VERSION="1.9.5"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"


helm template ingress-nginx ingress-nginx \
--repo https://kubernetes.github.io/ingress-nginx \
--version ${CHART_VERSION} \
--namespace ingress-nginx \
> $SCRIPT_DIR/nginx-ingress.${APP_VERSION}.yaml