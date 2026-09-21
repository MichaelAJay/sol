#!/usr/bin/env node
// Usage: node send-tx.mjs <amt-sol> <target-address> [memo]
//
// Sends <amt-sol> SOL from Alice -> target and the same amount from
// Bob -> target in a SINGLE transaction. If a non-blank memo is given,
// a memo instruction is appended. Alice pays the transaction fee.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  address,
  appendTransactionMessageInstruction,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createSolanaRpcSubscriptionsApi,
  createTransactionMessage,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';

import { getTransferSolInstruction } from '@solana-program/system';
import { getAddMemoInstruction } from '@solana-program/memo';

const RPC_URL = 'https://api.devnet.solana.com';

// Parse a decimal SOL amount (e.g. "1.5") into whole lamports.
function solToLamports(amt) {
  const m = /^(\d+)(?:\.(\d{1,9}))?$/.exec(amt);
  if (!m) throw new Error(`Invalid SOL amount: ${amt}`);
  return BigInt(m[1]) * 1_000_000_000n + BigInt((m[2] ?? '').padEnd(9, '0') || '0');
}

const [amtArg, targetArg, memoArg] = process.argv.slice(2);
if (!amtArg || !targetArg) {
  console.error('Usage: node send-tx.mjs <amt-sol> <target-address> [memo]');
  process.exit(1);
}
const AMOUNT = lamports(solToLamports(amtArg));
const destination = address(targetArg);
const memo = memoArg?.trim() ?? '';

const KEYS_DIR = fileURLToPath(new URL('./devnet/keys/', import.meta.url));
const loadSigner = async (file) =>
  createKeyPairSignerFromBytes(new Uint8Array(JSON.parse(await readFile(KEYS_DIR + file, 'utf8'))));

// My specific files - you'll need to create keypairs and fund their addresses yourself here
const alice = await loadSigner('20260916093058-19045.json');
const bob = await loadSigner('20260916093058-7659.json');

const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com', createSolanaRpcSubscriptionsApi());
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  // Alice pays the transaction fee.
  (tx) => setTransactionMessageFeePayer(alice.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  // Instruction 1: Alice -> target
  (tx) =>
    appendTransactionMessageInstruction(
      getTransferSolInstruction({ source: alice, destination, amount: AMOUNT }),
      tx,
    ),
  // Instruction 2: Bob -> target
  (tx) =>
    appendTransactionMessageInstruction(
      getTransferSolInstruction({ source: bob, destination, amount: AMOUNT }),
      tx,
    ),
  // Optional instruction 3: memo
  (tx) =>
    memo
      ? appendTransactionMessageInstruction(
          getAddMemoInstruction(
            { memo },
            // v0.14.0's default MEMO_PROGRAM_ADDRESS is the legacy Memo4c2p... id;
            // pin the canonical memo v1 program explicitly.
            { programAddress: address('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr') },
          ),
          tx,
        )
      : tx,
);

const transaction = await signTransactionMessageWithSigners(transactionMessage, [alice, bob]);
await sendAndConfirmTransaction(transaction, { commitment: 'confirmed' });

const signature = getSignatureFromTransaction(transaction);
console.log('Signature:', signature);
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
