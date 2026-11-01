#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

action=${1:-}
requested_image=${2:-}
state_file=.deployed-image
wait_seconds=${CUEFRAME_WAIT_SECONDS:-600}
registry_token=""
[[ -t 0 ]] || registry_token=$(cat)
registry_config=$(mktemp -d)
trap 'rm -rf "$registry_config"' EXIT

fail() {
  echo "$*" >&2
  exit 1
}

env_value() {
  sed -n "s/^$1=//p" .env | tail -n 1 | tr -d "\"'"
}

[[ -f .env ]] || fail "Create $PWD/.env first. See docs/CUEFRAME_DEPLOY.md."
public_url=$(env_value CUEFRAME_PUBLIC_URL)
[[ $public_url == https://* ]] || fail "CUEFRAME_PUBLIC_URL in .env must be an https:// URL."
[[ -n $(env_value CUEFRAME_PASSWORD) ]] || fail "CUEFRAME_PASSWORD is missing from .env."
[[ -n $(env_value CUEFRAME_SESSION_TOKEN) ]] || fail "CUEFRAME_SESSION_TOKEN is missing from .env."

public_host=${public_url#https://}
public_host=${public_host%%/*}
current_image=$(cat "$state_file" 2>/dev/null || true)
stack_image=${current_image:-$requested_image}

compose() {
  CUEFRAME_IMAGE=${stack_image:-none} docker compose -p cueframe -f compose.yaml -f compose.azure.yaml "$@"
}

pull_image() {
  if [[ -n $registry_token ]]; then
    printf '%s' "$registry_token" | DOCKER_CONFIG=$registry_config docker login ghcr.io --username deploy --password-stdin
  fi
  DOCKER_CONFIG=$registry_config docker pull --quiet "$1"
}

check_public() {
  curl --silent --show-error --fail --output /dev/null --max-time 10 \
    --retry 18 --retry-delay 10 --retry-all-errors \
    --resolve "$public_host:443:127.0.0.1" "$public_url/api/health"
}

bring_up() {
  stack_image=$1
  compose up --detach --no-build --pull missing --remove-orphans --wait --wait-timeout "$wait_seconds" &&
    check_public
}

stop_stack() {
  compose down --remove-orphans
}

report_failure() {
  compose ps --all || true
  echo "Read the logs on the VM: docker compose -p cueframe logs cueframe proxy" >&2
}

require_deployed() {
  [[ -n $current_image ]] || fail "Nothing is deployed yet. Run the deploy action first."
}

deploy() {
  [[ -n $requested_image ]] || fail "The deploy action needs an image."
  pull_image "$requested_image"
  stop_stack
  if ! bring_up "$requested_image"; then
    report_failure
    [[ -n $current_image ]] || fail "The first deploy failed, so there is nothing to roll back to."
    echo "The new image failed. Rolling back to $current_image." >&2
    stop_stack
    bring_up "$current_image" || fail "Rollback failed. The site is down."
    fail "Rolled back to $current_image."
  fi
  printf '%s\n' "$requested_image" >"$state_file"
  compose run --rm --no-TTY library-index ||
    echo "Library indexing failed. The site is up without fresh search vectors." >&2
  docker image prune --all --force --filter until=168h >/dev/null
}

case $action in
  deploy)
    deploy
    ;;
  recompose)
    require_deployed
    stop_stack
    bring_up "$current_image" || {
      report_failure
      fail "The stack did not come back."
    }
    ;;
  restart)
    require_deployed
    compose restart
    bring_up "$current_image" || {
      report_failure
      fail "The stack did not come back."
    }
    ;;
  up)
    require_deployed
    bring_up "$current_image" || {
      report_failure
      fail "The stack did not come up."
    }
    ;;
  down)
    stop_stack
    ;;
  *)
    fail "Usage: vm-stack.sh deploy <image> | recompose | restart | up | down"
    ;;
esac

compose ps
echo "$action finished for ${stack_image:-no image}."
