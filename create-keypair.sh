#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <devnet|local>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
env="$1"
case "$env" in
  devnet|local) ;;
  *)
    echo "Error: argument must be 'devnet' or 'local'" >&2
    exit 1
    ;;
esac

keys_dir="$SCRIPT_DIR/$env/keys"
mkdir -p "$keys_dir"

keypair_path="$keys_dir/$(date +%Y%m%d%H%M%S)-$RANDOM.json"
solana-keygen new --no-bip39-passphrase -o "$keypair_path" >/dev/null

address=$(solana-keygen pubkey "$keypair_path" | awk '{print $1}')

echo "Keypair: $keypair_path"
echo "Address: $address"
