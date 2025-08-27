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
      "name": "flip",
      "discriminator": [
        24,
        243,
        78,
        161,
        192,
        246,
        102,
        103
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
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
          "name": "user_action",
          "type": "bool"
        },
        {
          "name": "bid",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
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
  "types": [
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
          }
        ]
      }
    }
  ]
}



/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solflip.json`.
 */
export type Solflip = {
  "address": "3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr",
  "metadata": {
    "name": "solflip",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "flip",
      "discriminator": [
        24,
        243,
        78,
        161,
        192,
        246,
        102,
        103
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "flipAccount",
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "string"
        },
        {
          "name": "userAction",
          "type": "bool"
        },
        {
          "name": "bid",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "flipAccount",
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
  "types": [
    {
      "name": "flipAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "userAction",
            "type": "bool"
          },
          {
            "name": "aiAction",
            "type": "bool"
          },
          {
            "name": "bid",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
