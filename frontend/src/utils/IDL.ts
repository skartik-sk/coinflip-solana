export const IDL = {
  "address": "3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr",
  "metadata": {
    "name": "solflip",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "commit_flip",
      "discriminator": [
        240,
        0,
        0,
        82,
        9,
        204,
        182,
        176
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "commitment_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "flip_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  108,
                  105,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "_seed",
          "type": "string"
        },
        {
          "name": "commitment_hash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "bid",
          "type": "u64"
        }
      ]
    },
    {
      "name": "reveal_flip",
      "discriminator": [
        224,
        161,
        219,
        36,
        112,
        71,
        100,
        89
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "commitment_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  105,
                  116,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "flip_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  108,
                  105,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "string"
        },
        {
          "name": "user_choice",
          "type": "bool"
        },
        {
          "name": "nonce",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "CommitmentAccount",
      "discriminator": [
        155,
        206,
        108,
        147,
        168,
        110,
        100,
        181
      ]
    },
    {
      "name": "FlipAccount",
      "discriminator": [
        15,
        83,
        79,
        25,
        183,
        242,
        93,
        135
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyRevealed",
      "msg": "Commitment already revealed"
    },
    {
      "code": 6001,
      "name": "CommitmentExpired",
      "msg": "Commitment has expired"
    },
    {
      "code": 6002,
      "name": "InvalidReveal",
      "msg": "Invalid reveal - hash doesn't match"
    },
    {
      "code": 6003,
      "name": "InsufficientVaultFunds",
      "msg": "Insufficient funds in vault for payout"
    }
  ],
  "types": [
    {
      "name": "CommitmentAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "commitment_hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bid",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "revealed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "FlipAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "user_action",
            "type": "bool"
          },
          {
            "name": "ai_action",
            "type": "bool"
          },
          {
            "name": "bid",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "result",
            "type": {
              "defined": {
                "name": "GameResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "GameResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Won"
          },
          {
            "name": "Lost"
          }
        ]
      }
    }
  ]
} as const;

export type Solflip = typeof IDL;
