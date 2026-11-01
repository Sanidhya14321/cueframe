#!/usr/bin/env bash
set -euo pipefail

action=$1
image=${2:-}
remote_dir=/opt/cueframe

: "${AZURE_VM_HOST:?Set the AZURE_VM_HOST secret}"
: "${AZURE_VM_USER:?Set the AZURE_VM_USER secret}"
: "${AZURE_VM_SSH_KEY:?Set the AZURE_VM_SSH_KEY secret}"
: "${AZURE_VM_KNOWN_HOSTS:?Set the AZURE_VM_KNOWN_HOSTS secret}"

ssh_dir=$(mktemp -d)
trap 'rm -rf "$ssh_dir"' EXIT
umask 077
printf '%s\n' "$AZURE_VM_SSH_KEY" >"$ssh_dir/key"
printf '%s\n' "$AZURE_VM_KNOWN_HOSTS" >"$ssh_dir/known-hosts"

on_vm() {
  ssh -i "$ssh_dir/key" \
    -o BatchMode=yes \
    -o IdentitiesOnly=yes \
    -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$ssh_dir/known-hosts" \
    -o ConnectTimeout=20 \
    -o ServerAliveInterval=30 \
    "$AZURE_VM_USER@$AZURE_VM_HOST" "$@"
}

tar -cf - compose.yaml -C deploy/azure compose.azure.yaml vm-stack.sh | on_vm "tar -xf - -C $remote_dir"
printf '%s' "${REGISTRY_TOKEN:-}" | on_vm "bash $remote_dir/vm-stack.sh $(printf '%q %q' "$action" "$image")"
