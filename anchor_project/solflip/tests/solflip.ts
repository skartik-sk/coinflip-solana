import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solflip } from "../target/types/solflip";
import { assert } from "chai";

describe("solflip",  () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = anchor.workspace.solflip as Program<Solflip>;

// derive the vault PDA used by the program
const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("vault")],
  program.programId
);

it("with 0 vault balance!", async () => {
  const seed = Math.floor(Date.now() ).toString();
  const [flipPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("flip"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
    program.programId
  );
  await airdrop(provider.connection, provider.wallet.payer.publicKey);
  await airdrop(provider.connection, vaultPda, 0.1 * anchor.web3.LAMPORTS_PER_SOL);
  console.log("reached here");
  assert.equal(await provider.connection.getBalance(vaultPda), 0.1 * anchor.web3.LAMPORTS_PER_SOL);
  const userBalanceBefore = await provider.connection.getBalance(provider.wallet.payer.publicKey);
  const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);    
    const tx = await program.methods.flip(
      seed,
      false,
      new anchor.BN(1*anchor.web3.LAMPORTS_PER_SOL),
    )
    .accounts({
      user: provider.wallet.payer.publicKey,
      flipAccount: flipPda,
      vault: vaultPda,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([provider.wallet.payer])
    .rpc();
    

    const userBalanceAfter = await provider.connection.getBalance(provider.wallet.payer.publicKey);


    const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);


    console.log("User balance before:", userBalanceBefore);
    console.log("User balance after:", userBalanceAfter);
    console.log("Vault balance before:", vaultBalanceBefore);
    console.log("Vault balance after:", vaultBalanceAfter);

    console.log("Your transaction signature", tx);
  });

  it("heads", async () => {
 const seed = Math.floor(Date.now() ).toString();
    const [flipPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("flip"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
      program.programId
    );
await  airdrop(provider.connection, vaultPda, 10 * anchor.web3.LAMPORTS_PER_SOL);
 const userBalanceBefore = await provider.connection.getBalance(provider.wallet.publicKey);
 const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);
    const tx = await program.methods.flip(
      seed,
       false,
    new anchor.BN(1*anchor.web3.LAMPORTS_PER_SOL),
    )
    .accounts({
      user: provider.wallet.publicKey,
      flipAccount: flipPda,
      vault: vaultPda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc({skipPreflight: true});
    const userBalanceAfter = await provider.connection.getBalance(provider.wallet.publicKey);
    const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);


    console.log("User balance before:", userBalanceBefore);
    console.log("User balance after:", userBalanceAfter);
    console.log("Vault balance before:", vaultBalanceBefore);
    console.log("Vault balance after:", vaultBalanceAfter);

    console.log("Your transaction signature", tx);

  });

  it("tails", async () => {
  const seed = Math.floor(Date.now() ).toString();
    const [flipPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("flip"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
      program.programId
    );
  await  airdrop(provider.connection, vaultPda, 10 * anchor.web3.LAMPORTS_PER_SOL);

    const userBalanceBefore = await provider.connection.getBalance(provider.wallet.publicKey);
    const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);
    const tx = await program.methods.flip(
     seed,
       true,
    new anchor.BN(1*anchor.web3.LAMPORTS_PER_SOL),
    )
    .accounts({
      user: provider.wallet.publicKey,
      flipAccount: flipPda,
      vault: vaultPda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    const userBalanceAfter = await provider.connection.getBalance(provider.wallet.publicKey);
    const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);

    console.log("User balance before:", userBalanceBefore);
    console.log("User balance after:", userBalanceAfter);
    console.log("Vault balance before:", vaultBalanceBefore);
    console.log("Vault balance after:", vaultBalanceAfter);

   
    console.log("Your transaction signature", tx);
  });
});



async function airdrop(connection: any, address: any, amount = 1 * anchor.web3.LAMPORTS_PER_SOL) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}