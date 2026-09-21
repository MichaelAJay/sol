# Solana Dev — Agent Notes

## Running commands

Before running any Solana command, first check `CHEATSHEET.md` for the exact command, flags, and relevant reference data (mints, program IDs).

If the command isn't covered there, fall back to the Solana CLI directly — the `solana` and `spl-token` binaries (use `--help` to discover subcommands and flags).

## Named accounts (Alice, Bob, Charlie)

Any time I reference actions related to **Alice**, **Bob**, and/or **Charlie** — unless otherwise specified — the first place to look is:

`/Users/bpmj/dev/chains/sol/devnet/keys/aliases.sh`

It maps each name to a keypair file and public key (source it to use the `ALICE` / `BOB` / `CHARLIE` variables).

## Token names in instructions

When I use a token name in an instruction (e.g. "Send 10 devnet USDC to <address>"), look up its mint in the **"Token mints"** section of `CHEATSHEET.md` before running the command. That section is the single source of truth for the name → mint mapping — do not guess or re-derive the mint.

## Pre-token example script

When I say something like "Use the pre token example script to send <x> USDC with memo <M>", run (from the repo root):

```bash
node pre-token-example.mjs <x> <mint> "<M>"
```

- Look up `<mint>` in the **"Token mints"** section of `CHEATSHEET.md` (same rule as any token name).
- The memo is the third arg and is optional — omit it entirely if I didn't specify one.
- What the script does: Alice (background sender, fee payer) creates Charlie's ATA for the mint, funds it with `<x>`, and Charlie immediately sends the full amount to the fixed receiver `4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz` — all in one transaction (the memo instruction, if any, is appended last). If Charlie's ATA already exists and is empty, it is closed in a separate transaction first; if it holds tokens, the script aborts.
