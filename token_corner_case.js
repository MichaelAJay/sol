const tx = {
  txid: "g6G5hSjxFt6M4yvfqiiUo3zuj4mAXdZKvGc4fLFQzbLZg5Wc34ZG7XtmQaFNG7JViD2aUCR3cd96TqPht9zY7qf",
  status: "confirmed",
  confirmations: 1,
  version: 0,
  instructions: {
    createAssociatedToken: [
      {
        payer: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
        associatedTokenAccount: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
        owner: "Ehxqhao6bGMztXPSLUn4VpJyfwHKSw8YrQQuJYUQShUy",
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
    ],
    transferCheckedToken: [
      {
        authority: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
        destination: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        source: "Hx2NNVNB4rHHKMed1LF6wHWTPG47rhVoPH3neqPSLcJ3",
        amount: 1000000,
        decimals: 6,
      },
      {
        authority: "Ehxqhao6bGMztXPSLUn4VpJyfwHKSw8YrQQuJYUQShUy",
        destination: "tUzVWSEbFFRy1g7QjMbeKK8VwpS1b7j6Ztyr58kbrkq",
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        source: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
        amount: 1000000,
        decimals: 6,
      },
    ],
    createAssociatedTokenIdempotent: [
      {
        payer: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
        associatedTokenAccount: "tUzVWSEbFFRy1g7QjMbeKK8VwpS1b7j6Ztyr58kbrkq",
        owner: "4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz",
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
    ],
    memo: [
      {
        memo: "U48FH4kGPXBMxi2xEspRFtbBjuDV8wr5YNxfy9suibAciDDPJ81fQjnMwDcX",
      },
    ],
  },
  feePayerAddress: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
  lifetimeConstraint: {
    blockhash: "7yEmMxk4TXwpAc22R5CGTMkA8ycedUh89omGZtAz1Cxw",
    lastValidBlockHeight: 18446744073709551615n,
  },
  accountKeys: [
    "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
    "Ehxqhao6bGMztXPSLUn4VpJyfwHKSw8YrQQuJYUQShUy",
    "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
    "Hx2NNVNB4rHHKMed1LF6wHWTPG47rhVoPH3neqPSLcJ3",
    "tUzVWSEbFFRy1g7QjMbeKK8VwpS1b7j6Ztyr58kbrkq",
    "11111111111111111111111111111111",
    "4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz",
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  ],
  blockTime: 1790016422,
  slot: 502039707,
  innerInstructions: {
    unknownInstruction: [
      {
        topLevelInstructionIndex: 0,
        parsed: {
          info: {
            extensionTypes: [
              "immutableOwner",
            ],
            mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          },
          type: "getAccountDataSize",
        },
        program: "spl-token",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        stackHeight: 2,
        programAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        topLevelInstructionIndex: 0,
        parsed: {
          info: {
            lamports: 1488440n,
            newAccount: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
            owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            source: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
            space: 165n,
          },
          type: "createAccount",
        },
        program: "system",
        programId: "11111111111111111111111111111111",
        stackHeight: 2,
        programAddress: "11111111111111111111111111111111",
      },
      {
        topLevelInstructionIndex: 0,
        parsed: {
          info: {
            account: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
          },
          type: "initializeImmutableOwner",
        },
        program: "spl-token",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        stackHeight: 2,
        programAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        topLevelInstructionIndex: 0,
        parsed: {
          info: {
            account: "4PZHAYpSawAv963s9How5Uju2m88kdpfdraP9dCT94Yq",
            mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
            owner: "Ehxqhao6bGMztXPSLUn4VpJyfwHKSw8YrQQuJYUQShUy",
          },
          type: "initializeAccount3",
        },
        program: "spl-token",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        stackHeight: 2,
        programAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
    ],
  },
  meta: {
    computeUnitsConsumed: 41095n,
    costUnits: 43827n,
    err: null,
    fee: 10000n,
    innerInstructions: [
      {
        index: 0,
        instructions: [
          {
            accounts: [
              7,
            ],
            data: "84eT",
            programIdIndex: 10,
            stackHeight: 2,
          },
          {
            accounts: [
              0,
              2,
            ],
            data: "111135fAZn8PZBEU8J8iUmUTdbmBE6po1LhhgEJXngDjhxmUTshDA8EHdXaMJUsXdMg3PE",
            programIdIndex: 5,
            stackHeight: 2,
          },
          {
            accounts: [
              2,
            ],
            data: "P",
            programIdIndex: 10,
            stackHeight: 2,
          },
          {
            accounts: [
              2,
              7,
            ],
            data: "6aqfWdnKtt7dqA1UxRdyPynkNAps8rgQFZKako8ADjquw",
            programIdIndex: 10,
            stackHeight: 2,
          },
        ],
      },
    ],
    loadedAddresses: {
      readonly: [
      ],
      writable: [
      ],
    },
    logMessages: [
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: Create",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 179 of 994580 compute units",
      "Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program 11111111111111111111111111111111 invoke [2]",
      "Program 11111111111111111111111111111111 success",
      "Program log: Initialize the associated token account",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 37 of 989491 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 233 of 987029 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 13508 of 1000000 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 105 of 986492 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: CreateIdempotent",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 4437 of 986387 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 105 of 981950 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr invoke [1]",
      "Program log: Memo (len 60): \"U48FH4kGPXBMxi2xEspRFtbBjuDV8wr5YNxfy9suibAciDDPJ81fQjnMwDcX\"",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr consumed 22940 of 981845 compute units",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr success",
    ],
    postBalances: [
      3252029954n,
      3333333332n,
      1488440n,
      1488440n,
      2039280n,
      1n,
      49060588864n,
      420923285289n,
      5938070540n,
      41509609334n,
      20367267856n,
    ],
    postTokenBalances: [
      {
        accountIndex: 2,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        owner: "Ehxqhao6bGMztXPSLUn4VpJyfwHKSw8YrQQuJYUQShUy",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "0",
          decimals: 6,
          uiAmount: null,
          uiAmountString: "0",
        },
      },
      {
        accountIndex: 3,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        owner: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "19000000",
          decimals: 6,
          uiAmount: 19n,
          uiAmountString: "19",
        },
      },
      {
        accountIndex: 4,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        owner: "4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "15000000",
          decimals: 6,
          uiAmount: 15n,
          uiAmountString: "15",
        },
      },
    ],
    preBalances: [
      3253528394n,
      3333333332n,
      0n,
      1488440n,
      2039280n,
      1n,
      49060588864n,
      420923285289n,
      5938070540n,
      41509609334n,
      20367267856n,
    ],
    preTokenBalances: [
      {
        accountIndex: 3,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        owner: "4pwGcyxTPBL8V4C2r7FvZGUg6L7YM5n3a7Xea6scip2f",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "20000000",
          decimals: 6,
          uiAmount: 20n,
          uiAmountString: "20",
        },
      },
      {
        accountIndex: 4,
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        owner: "4QTWwM3WJyrmcz5qGPfVAUQBxNALGS3FdM6gYXKRVZvz",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "14000000",
          decimals: 6,
          uiAmount: 14n,
          uiAmountString: "14",
        },
      },
    ],
    rewards: [
    ],
    status: {
      Ok: null,
    },
  },
};

// Export `tx` as a JSON file (BigInts are serialized as strings).
const { writeFileSync } = require("node:fs");
const { join } = require("node:path");

const outPath = join(__dirname, "token_corner_case.json");
writeFileSync(
  outPath,
  JSON.stringify(tx, (key, value) => (typeof value === "bigint" ? value.toString() : value), 2) + "\n"
);
console.log(`Wrote ${outPath}`);