# Solana CLI Cheatsheet

Verified against: `solana-cli 2.1.16` (Agave), `spl-token-cli 5.1.0`

## 1) Create a new keypair

```bash
solana-keygen new -o path/to/keypair.json
```

- Prints the public key and a BIP-39 recovery phrase (type `y` to skip the phrase).
- `--no-bip39-passphrase` suppresses the recovery phrase.
- Repo helper (writes to `devnet/keys` or `local/keys`): `./create-keypair.sh devnet`

## 2) Check keypair address

```bash
solana-keygen pubkey path/to/keypair.json
```

## 3) Check address balance

```bash
solana balance <ADDRESS>
```

- Also accepts `--keypair path/to/keypair.json` instead of a raw address.
- Add `--lamports` to show the raw lamport amount.

## 4) Send SOL

```bash
solana transfer <RECIPIENT_ADDRESS> <AMOUNT_IN_SOL> --keypair path/to/keypair.json
```

With a memo:

```bash
solana transfer <RECIPIENT_ADDRESS> <AMOUNT_IN_SOL> \
  --keypair path/to/keypair.json \
  --with-memo "my memo text"
```

- `--allow-unfunded-recipient` allows sending to an address with no prior SOL.
- `--fee-payer <KEYPAIR>` sets the fee payer if it differs from the sender.

## 5) Send a token (SPL Token)

In Agave 2.x, `solana spl-token` was removed — use the standalone `spl-token` binary:

```bash
spl-token transfer <TOKEN_MINT_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS> \
  --owner path/to/keypair.json --fee-payer path/to/keypair.json
```

With a memo:

```bash
spl-token transfer <TOKEN_MINT_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS> \
  --owner path/to/keypair.json --fee-payer path/to/keypair.json \
  --with-memo "my memo text"
```

- There is no `--keypair` flag on `spl-token transfer` (5.1.0): use `--owner` for the sender's keypair and `--fee-payer` to make the sender pay fees (otherwise the client keypair pays).
- `RECIPIENT_ADDRESS` can be a wallet (its associated token account is used) or a token account.
- `--from <TOKEN_ACCOUNT>` specifies a sending token account other than the default associated one.
- `ALL` can be used as `AMOUNT` to transfer the entire balance.
- The recipient's token account is auto-created if needed; the sender pays any rent.

## 6) Check token balances (list all tokens a wallet holds)

`spl-token` 5.1.0 has no `balances` subcommand — `spl-token balance` only reads a single known mint/account. To enumerate everything a wallet holds, call the RPC directly:

```bash
WALLET=<ADDRESS>
RPC=https://api.devnet.solana.com
for PROG in \
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" \   # SPL Token
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"; do  # SPL Token-2022
  curl -s -X POST "$RPC" -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"getTokenAccountsByOwner\",\"params\":[\"$WALLET\",{\"programId\":\"$PROG\"},{\"encoding\":\"jsonParsed\"}]}"
  echo
done
```

- Each result has `mint`, `tokenAmount` (`amount` = raw units, `uiAmountString` = human-readable), and the token account `pubkey`.
- Loop over both program IDs to catch Token and Token-2022 tokens.

## 7) Query a mint

```bash
RPC=https://api.devnet.solana.com
curl -s -X POST "$RPC" -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getAccountInfo","params":["<MINT_ADDRESS>",{"encoding":"jsonParsed"}]}'
```

- Parsed `info` gives `decimals`, `supply`, `mintAuthority`, `freezeAuthority` — use `decimals` to convert raw amounts.

## 8) Token mints

Token names I use in instructions (e.g. "send 10 devnet USDC to ...") map to mints here. At most two.

| Name | Mint | Decimals |
|------|------|----------|
| devnet USDC | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` | 6 |

- "devnet USDC" is the actual Solana Devnet USDC token.