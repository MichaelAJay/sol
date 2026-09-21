// create-fund-spend-ata.js
//
// npm install @solana/kit @solana-program/token @solana-program/memo
//
// Usage:
//   node create-fund-spend-ata.js <amount> <mint-address> [memo]
//   node create-fund-spend-ata.js 5.25 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU "optional memo"
//
// The amount argument is expressed in token/display units.
// For a 6-decimal mint:
//   "5"    -> 5_000_000 atomic units
//   "5.25" -> 5_250_000 atomic units
//
// Transaction under test:
//
//   IX 1: Create senderToReceiver ATA
//   IX 2: backgroundSender -> senderToReceiver ATA
//   IX 3: Create receiver ATA if needed
//   IX 4: senderToReceiver ATA -> receiver
//
// If senderToReceiver already has an EMPTY ATA, that ATA is first closed
// in a SEPARATE transaction and confirmed before the transaction under test.

import { readFile } from 'node:fs/promises';

import {
  address,
  appendTransactionMessageInstructions,
  assertIsSendableTransaction,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners
} from '@solana/kit';

import { getAddMemoInstruction } from '@solana-program/memo';

import {
  TOKEN_PROGRAM_ADDRESS,
  fetchMint,
  fetchMaybeToken,
  fetchToken,
  findAssociatedTokenPda,
  getCloseAccountInstruction,
  getCreateAssociatedTokenIdempotentInstruction,
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction
} from '@solana-program/token';


// =============================================================================
// CONFIG
// =============================================================================

const RPC_URL = 'https://api.devnet.solana.com';
const RPC_SUBSCRIPTIONS_URL = 'wss://api.devnet.solana.com';

const RECEIVER_ADDRESS = address(
  '4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz'
);

const SENDER_TO_RECEIVER_KEYPAIR =
  './devnet/keys/20260916093058-12202.json'; // Charlie

const BACKGROUND_SENDER_KEYPAIR =
  './devnet/keys/20260916093058-19045.json'; // Alice


// =============================================================================
// HELPERS
// =============================================================================

async function loadSigner(filename) {
  const json = JSON.parse(await readFile(filename, 'utf8'));

  return createKeyPairSignerFromBytes(
    new Uint8Array(json)
  );
}


/**
 * Convert a human/display token amount to the mint's atomic units without
 * passing through Number and introducing floating-point rounding.
 *
 * Examples for decimals=6:
 *
 *   "1"        -> 1_000_000n
 *   "1.5"      -> 1_500_000n
 *   "0.000001" -> 1n
 */
function tokenAmountToAtomicUnits(value, decimals) {
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
    throw new Error(
      `Invalid amount "${value}". ` +
      'Expected a positive token amount such as 5, 5.25, or 0.000001.'
    );
  }

  const [wholePart, fractionalPart = ''] = value.split('.');

  if (fractionalPart.length > decimals) {
    throw new Error(
      `Amount "${value}" has ${fractionalPart.length} decimal places, ` +
      `but this mint supports only ${decimals}.`
    );
  }

  const paddedFraction = fractionalPart.padEnd(decimals, '0');

  const atomic =
    BigInt(wholePart) * (10n ** BigInt(decimals)) +
    BigInt(paddedFraction || '0');

  if (atomic <= 0n) {
    throw new Error('Amount must be greater than zero.');
  }

  // SPL Token transfer amounts are u64.
  if (atomic > 0xffffffffffffffffn) {
    throw new Error('Amount exceeds the SPL Token u64 maximum.');
  }

  return atomic;
}


function atomicUnitsToTokenAmount(amount, decimals) {
  if (decimals === 0) {
    return amount.toString();
  }

  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionString = fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '');

  return `${whole}.${fractionString}`;
}


/**
 * Build, sign, send, and confirm one transaction.
 *
 * backgroundSender is the fee payer. Any other required signers are pulled
 * from the instructions by signTransactionMessageWithSigners().
 */
async function sendInstructions({
  rpc,
  rpcSubscriptions,
  backgroundSender,
  instructions
}) {
  const { value: latestBlockhash } =
    await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),

    tx =>
      setTransactionMessageFeePayerSigner(
        backgroundSender,
        tx
      ),

    tx =>
      setTransactionMessageLifetimeUsingBlockhash(
        latestBlockhash,
        tx
      ),

    tx =>
      appendTransactionMessageInstructions(
        instructions,
        tx
      )
  );

  const signedTransaction =
    await signTransactionMessageWithSigners(
      transactionMessage
    );

  assertIsSendableTransaction(signedTransaction);
  assertIsTransactionWithBlockhashLifetime(
    signedTransaction
  );

  const signature =
    getSignatureFromTransaction(signedTransaction);

  const sendAndConfirmTransaction =
    sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions
    });

  await sendAndConfirmTransaction(
    signedTransaction,
    {
      commitment: 'confirmed'
    }
  );

  return signature;
}


// =============================================================================
// MAIN
// =============================================================================

async function main() {
  // ---------------------------------------------------------------------------
  // Parse CLI argument.
  // ---------------------------------------------------------------------------

  const amountArg = process.argv[2];
  const mintArg = process.argv[3];
  const memo = process.argv[4]?.trim() ?? '';

  if (!amountArg || !mintArg) {
    throw new Error(
      'Missing amount and/or mint address.\n\n' +
      'Usage:\n' +
      '  node create-fund-spend-ata.js <amount> <mint-address> [memo]\n\n' +
      'Example:\n' +
      '  node create-fund-spend-ata.js 5.25 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU "my memo"'
    );
  }

  const MINT_ADDRESS = address(mintArg);

  const rpc = createSolanaRpc(RPC_URL);

  const rpcSubscriptions =
    createSolanaRpcSubscriptions(
      RPC_SUBSCRIPTIONS_URL
    );

  const senderToReceiver =
    await loadSigner(
      SENDER_TO_RECEIVER_KEYPAIR
    );

  const backgroundSender =
    await loadSigner(
      BACKGROUND_SENDER_KEYPAIR
    );

  // ---------------------------------------------------------------------------
  // Fetch mint information and convert the CLI amount.
  // ---------------------------------------------------------------------------

  const mintAccount =
    await fetchMint(rpc, MINT_ADDRESS);

  const decimals =
    mintAccount.data.decimals;

  const amount =
    tokenAmountToAtomicUnits(
      amountArg,
      decimals
    );

  console.log('Mint:               ', MINT_ADDRESS);
  console.log('Mint decimals:      ', decimals);
  console.log('Amount:             ', amountArg);
  console.log('Atomic amount:      ', amount.toString());
  console.log('Receiver:           ', RECEIVER_ADDRESS);
  console.log(
    'Sender to receiver: ',
    senderToReceiver.address
  );
  console.log(
    'Background sender:  ',
    backgroundSender.address
  );

  // ---------------------------------------------------------------------------
  // Derive all three ATAs.
  // ---------------------------------------------------------------------------

  const [backgroundSenderAta] =
    await findAssociatedTokenPda({
      mint: MINT_ADDRESS,
      owner: backgroundSender.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS
    });

  const [senderToReceiverAta] =
    await findAssociatedTokenPda({
      mint: MINT_ADDRESS,
      owner: senderToReceiver.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS
    });

  const [receiverAta] =
    await findAssociatedTokenPda({
      mint: MINT_ADDRESS,
      owner: RECEIVER_ADDRESS,
      tokenProgram: TOKEN_PROGRAM_ADDRESS
    });

  console.log();
  console.log(
    'Background sender ATA:  ',
    backgroundSenderAta
  );
  console.log(
    'Sender-to-receiver ATA: ',
    senderToReceiverAta
  );
  console.log(
    'Receiver ATA:           ',
    receiverAta
  );

  // ===========================================================================
  // PRECHECK 1:
  //
  // Background sender must already have an ATA and enough tokens.
  // ===========================================================================

  const backgroundTokenAccount =
    await fetchToken(
      rpc,
      backgroundSenderAta
    );

  const backgroundBalance =
    backgroundTokenAccount.data.amount;

  console.log();
  console.log(
    'Background balance:     ',
    atomicUnitsToTokenAmount(
      backgroundBalance,
      decimals
    )
  );

  if (backgroundBalance < amount) {
    throw new Error(
      '\nBackground sender has insufficient token balance.\n\n' +
      `  ATA:       ${backgroundSenderAta}\n` +
      `  Available: ${atomicUnitsToTokenAmount(backgroundBalance, decimals)}\n` +
      `  Required:  ${amountArg}\n` +
      `  Mint:      ${MINT_ADDRESS}`
    );
  }

  // ===========================================================================
  // PRECHECK 2:
  //
  // The experiment requires senderToReceiver's ATA NOT to exist at the start
  // of the transaction under test.
  //
  // If it currently exists and is EMPTY:
  //
  //   1. close it in a separate transaction
  //   2. wait for confirmation
  //   3. verify it no longer exists
  //
  // If it contains tokens, abort. A normal SPL token account cannot be closed
  // until its token balance is zero, and this script should not implicitly
  // move or destroy somebody's tokens.
  // ===========================================================================

  const existingSenderAta =
    await fetchMaybeToken(
      rpc,
      senderToReceiverAta
    );

  if (existingSenderAta.exists) {
    const existingBalance =
      existingSenderAta.data.amount;

    console.log();
    console.log(
      'Sender-to-receiver ATA already exists.'
    );

    console.log(
      'Existing balance:      ',
      atomicUnitsToTokenAmount(
        existingBalance,
        decimals
      )
    );

    if (existingBalance !== 0n) {
      throw new Error(
        '\nCannot prepare test state: senderToReceiver already has an ATA ' +
        'with a nonzero token balance.\n\n' +
        `  ATA:     ${senderToReceiverAta}\n` +
        `  Balance: ${atomicUnitsToTokenAmount(existingBalance, decimals)}\n\n` +
        'The script will not move or burn these tokens automatically.'
      );
    }

    console.log(
      'Closing empty sender-to-receiver ATA...'
    );

    const closeSenderAtaInstruction =
      getCloseAccountInstruction({
        account: senderToReceiverAta,

        // Return the ATA's rent lamports to its owner.
        destination: senderToReceiver.address,

        // senderToReceiver owns the token account and must authorize closure.
        owner: senderToReceiver
      });

    const cleanupSignature =
      await sendInstructions({
        rpc,
        rpcSubscriptions,
        backgroundSender,
        instructions: [
          closeSenderAtaInstruction
        ]
      });

    console.log(
      'Cleanup confirmed:     ',
      cleanupSignature
    );

    // Explicitly verify our required precondition after confirmation.
    const afterCleanup =
      await fetchMaybeToken(
        rpc,
        senderToReceiverAta
      );

    if (afterCleanup.exists) {
      throw new Error(
        'Cleanup transaction confirmed, but senderToReceiver ATA still exists: ' +
        senderToReceiverAta
      );
    }

    console.log(
      'Verified ATA removed.'
    );
  } else {
    console.log();
    console.log(
      'Sender-to-receiver ATA does not exist. Good.'
    );
  }

  // ===========================================================================
  // NOW CONSTRUCT THE TRANSACTION UNDER TEST.
  //
  // At this point we have explicitly established:
  //
  //     senderToReceiverAta DOES NOT EXIST.
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // IX 1:
  //
  // Create senderToReceiver's ATA.
  //
  // backgroundSender pays for account creation, but senderToReceiver is the
  // token account's owner/authority.
  // ---------------------------------------------------------------------------

  const createSenderAtaInstruction =
    getCreateAssociatedTokenInstruction({
      payer: backgroundSender,
      ata: senderToReceiverAta,
      owner: senderToReceiver.address,
      mint: MINT_ADDRESS
    });

  // ---------------------------------------------------------------------------
  // IX 2:
  //
  // backgroundSender funds the ATA created by IX 1.
  // ---------------------------------------------------------------------------

  const fundSenderInstruction =
    getTransferCheckedInstruction({
      source: backgroundSenderAta,
      mint: MINT_ADDRESS,
      destination: senderToReceiverAta,
      authority: backgroundSender,
      amount,
      decimals
    });

  // ---------------------------------------------------------------------------
  // IX 3:
  //
  // Ensure the final receiver has an ATA.
  //
  // Idempotent because its pre-transaction existence doesn't matter to this
  // experiment.
  // ---------------------------------------------------------------------------

  const createReceiverAtaInstruction =
    getCreateAssociatedTokenIdempotentInstruction({
      payer: backgroundSender,
      ata: receiverAta,
      owner: RECEIVER_ADDRESS,
      mint: MINT_ADDRESS
    });

  // ---------------------------------------------------------------------------
  // IX 4:
  //
  // senderToReceiver immediately spends the tokens from the ATA that did not
  // exist before this transaction.
  // ---------------------------------------------------------------------------

  const sendToReceiverInstruction =
    getTransferCheckedInstruction({
      source: senderToReceiverAta,
      mint: MINT_ADDRESS,
      destination: receiverAta,
      authority: senderToReceiver,
      amount,
      decimals
    });

  console.log();
  const instructions = [
    createSenderAtaInstruction,
    fundSenderInstruction,
    createReceiverAtaInstruction,
    sendToReceiverInstruction
  ];

  if (memo) {
    instructions.push(
      getAddMemoInstruction(
        { memo },
        // v0.14.0's default MEMO_PROGRAM_ADDRESS is the legacy Memo4c2p... id;
        // pin the canonical memo v1 program explicitly.
        { programAddress: address('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr') }
      )
    );
  }

  console.log();
  console.log('Sending transaction under test...');

  const signature =
    await sendInstructions({
      rpc,
      rpcSubscriptions,
      backgroundSender,
      instructions
    });

  console.log();
  console.log('Confirmed.');
  console.log(
    'Transaction signature:',
    signature
  );
  console.log(
    `Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}


// =============================================================================
// ENTRYPOINT
// =============================================================================

main().catch(error => {
  console.error();
  console.error('ERROR:');
  console.error(
    error instanceof Error
      ? error.message
      : error
  );

  process.exitCode = 1;
});