# sol

Scripts and tooling for developing on the Solana blockchain (devnet).

## Prerequisites

- **Node.js** (for the `@solana/kit`-based scripts)
- **Solana CLI** — the `solana` and `spl-token` binaries (see `CHEATSHEET.md` for the versions this repo was verified against)

## Setup

```bash
npm install
node init.js
```

`init.js` creates three devnet keypairs in `devnet/keys/` (relative to the
repo root) and generates `devnet/keys/aliases.sh` in the same directory:

| File | Alias variable |
|------|----------------|
| `devnet/keys/alice.json` | `ALICE` |
| `devnet/keys/bob.json` | `BOB` |
| `devnet/keys/charlie.json` | `CHARLIE` |

Running `init.js` again is safe: existing keypair files are never
overwritten, and `aliases.sh` is regenerated from whatever files are
present.

### Fund the new wallets

The freshly generated addresses hold no SOL. Claim devnet SOL for each
address (e.g. from <https://faucet.solana.com>), then check:

```bash
source devnet/keys/aliases.sh
solana balance "$ALICE"
```

## Using the aliases

`aliases.sh` defines `ALICE`, `BOB`, and `CHARLIE` as **paths to the
keypair files** (with the wallet's address in a trailing comment). Source
it in any shell where you want to use them:

```bash
source devnet/keys/aliases.sh

solana balance "$ALICE"
solana transfer <RECIPIENT> 1 --keypair "$BOB"
spl-token transfer <MINT> 10 "$CHARLIE" --owner "$ALICE" --fee-payer "$ALICE"
```

## Scripts

| Script | Purpose |
|--------|---------|
| `init.js` | Generate the devnet keypairs and `aliases.sh` (run once after `npm install`) |
| `create-keypair.sh <devnet\|local>` | Create one additional keypair in `devnet/keys` or `local/keys` and print its address |
| `send-tx.mjs <amt-sol> <target> [memo]` | Send SOL from Alice and Bob to a target in a single transaction |
| `pre-token-example.mjs <amount> <mint> [memo]` | Alice creates and funds Charlie's ATA, Charlie immediately forwards the tokens to a fixed receiver |

> **Note:** `send-tx.mjs` and `pre-token-example.mjs` hardcode the
> keypair *filenames* the author uses. After running `init.js`, update
> those constants to point at `alice.json`, `bob.json`, and
> `charlie.json` (search for `devnet/keys/` in each file).

## References

- `CHEATSHEET.md` — Solana CLI commands, flags, and the token mints used
  in this repo (e.g. devnet USDC).
