#!/usr/bin/env node
// Usage: node init.js
//
// Creates three devnet keypairs in devnet/keys/ (relative to this file):
//
//   devnet/keys/alice.json
//   devnet/keys/bob.json
//   devnet/keys/charlie.json
//
// and writes devnet/keys/aliases.sh, which defines the shell variables
// ALICE / BOB / CHARLIE as paths to those keypair files:
//
//   source devnet/keys/aliases.sh && solana balance "$ALICE"
//
// Existing keypair files are NEVER overwritten; aliases.sh is always
// regenerated from whatever keypair files are present.
//
// After running this, fund the new addresses with devnet SOL, e.g. from
// https://faucet.solana.com

import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  createKeyPairFromPrivateKeyBytes,
  createKeyPairSignerFromBytes,
} from '@solana/kit';

const KEYS_DIR = fileURLToPath(new URL('./devnet/keys/', import.meta.url));

const NAMES = ['alice', 'bob', 'charlie'];

/**
 * Generate a fresh 64-byte keypair (32-byte secret key followed by the
 * derived 32-byte public key) and return { bytes, address }.
 */
async function generateKeyPair() {
  const secret = randomBytes(32);
  const { publicKey } = await createKeyPairFromPrivateKeyBytes(secret);
  const publicBytes = new Uint8Array(
    await crypto.subtle.exportKey('raw', publicKey)
  );
  const bytes = Buffer.concat([secret, Buffer.from(publicBytes)]);
  const address = (
    await createKeyPairSignerFromBytes(new Uint8Array(bytes))
  ).address;
  return { bytes, address };
}

/**
 * Derive the address of an existing keypair file (JSON array of 64 bytes).
 */
async function addressOfKeyPairFile(file) {
  const arr = JSON.parse(await readFile(file, 'utf8'));
  return (
    await createKeyPairSignerFromBytes(new Uint8Array(arr))
  ).address;
}

async function main() {
  await mkdir(KEYS_DIR, { recursive: true });

  const entries = [];

  for (const name of NAMES) {
    const file = `${KEYS_DIR}${name}.json`;

    if (existsSync(file)) {
      const address = await addressOfKeyPairFile(file);
      entries.push({ name, file, address, created: false });
      console.log(`kept   ${file}  ${address}`);
    } else {
      const { bytes, address } = await generateKeyPair();
      // Standard Solana keypair file format: JSON array of 64 numbers.
      await writeFile(file, JSON.stringify(Array.from(bytes)));
      entries.push({ name, file, address, created: true });
      console.log(`created ${file}  ${address}`);
    }
  }

  const lines = [
    '# Devnet keypair aliases',
    '# Source this file to use the ALICE/BOB/CHARLIE variables, e.g.:',
    '#   source devnet/keys/aliases.sh && solana balance "$ALICE"',
    '',
    '_KEY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
    '',
  ];

  for (const { name, file, address } of entries) {
    const varName = name.toUpperCase();
    lines.push(
      `${varName}="$_KEY_DIR/${name}.json"   # ${address}`.padEnd(
        64,
        ' '
      )
    );
  }

  lines.push('', 'unset _KEY_DIR', '');

  const aliasesFile = `${KEYS_DIR}aliases.sh`;
  await writeFile(aliasesFile, lines.join('\n'));
  console.log(`wrote  ${aliasesFile}`);

  console.log('\nNext steps:');
  console.log('  1. Fund the new addresses with devnet SOL (https://faucet.solana.com)');
  console.log('  2. source devnet/keys/aliases.sh');
  console.log('  3. solana balance "$ALICE"');
}

main().catch((error) => {
  console.error('ERROR:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
