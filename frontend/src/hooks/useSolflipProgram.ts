import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useAnchorProvider } from '../components/solana/SolanaProvider'
import { Program, web3, BN } from '@coral-xyz/anchor'
import { IDL, type Solflip } from '../utils/IDL'
import { useWallet } from '@solana/wallet-adapter-react'
import { keccak_256 } from 'js-sha3'

// Solflip program ID
const PROGRAM_ID = address('3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr')

export function useSolflipProgramId() {
  return useMemo(() => PROGRAM_ID, [])
}

export function useSolflipProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useSolflipProgramId()
  
  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

// Generate commitment hash
function generateCommitmentHash(userChoice: boolean, nonce: bigint, userPubkey: web3.PublicKey): Uint8Array {
  const data = new Uint8Array(1 + 8 + 32) // bool + u64 + pubkey
  
  // Add user choice (1 byte)
  data[0] = userChoice ? 1 : 0
  
  // Add nonce (8 bytes, little endian)
  const nonceBytes = new ArrayBuffer(8)
  const nonceView = new DataView(nonceBytes)
  nonceView.setBigUint64(0, nonce, true) // little endian
  data.set(new Uint8Array(nonceBytes), 1)
  
  // Add user pubkey (32 bytes)
  data.set(userPubkey.toBytes(), 9)
  
  return new Uint8Array(keccak_256.arrayBuffer(data))
}

// Phase 1: Commit mutation
export function useCommitFlip() {
  const { wallet } = useWallet()
  const provider = useAnchorProvider()
  const program = new Program(IDL as Solflip, provider)
  
  return useMutation({
    mutationFn: async ({ 
      userChoice, 
      bidAmount, 
      seed 
    }: { 
      userChoice: boolean
      bidAmount: number
      seed: string 
    }) => {
      if (!wallet || !provider.wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      // Generate random nonce for commitment
      const nonce = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
      
      // Generate commitment hash
      const commitmentHash = generateCommitmentHash(userChoice, nonce, provider.wallet.publicKey)
      
      // Get PDAs
      const [vaultPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        program.programId
      )
      
      const [commitmentPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("commitment"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
        program.programId
      )

      console.log('Committing flip with hash:', Array.from(commitmentHash))

      // Call commit_flip instruction
      const tx = await program.methods
        .commitFlip(seed, Array.from(commitmentHash), new BN(bidAmount * web3.LAMPORTS_PER_SOL))
        .accounts({
          user: provider.wallet.publicKey,
          commitmentAccount: commitmentPda,
          vault: vaultPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()

      return {
        signature: tx,
        nonce,
        userChoice,
        bidAmount,
        seed,
        commitmentHash: Array.from(commitmentHash)
      }
    },
    onSuccess: () => {
      toast.success('Commitment submitted!', {
        description: 'Your choice has been locked in. Now reveal to see the result!',
        duration: 4000,
      })
    },
    onError: (error) => {
      console.error('Commit failed:', error)
      toast.error('Failed to commit choice', {
        description: 'Please check your wallet connection and balance.',
        duration: 5000,
      })
    },
  })
}

// Phase 2: Reveal mutation
export function useRevealFlip() {
  const { wallet } = useWallet()
  const provider = useAnchorProvider()
  const program = new Program(IDL as Solflip, provider)
  
  return useMutation({
    mutationFn: async ({ 
      userChoice, 
      nonce, 
      seed 
    }: { 
      userChoice: boolean
      nonce: bigint
      seed: string 
    }) => {
      if (!wallet || !provider.wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      // Get PDAs
      const [vaultPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        program.programId
      )
      
      const [commitmentPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("commitment"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
        program.programId
      )
      
      const [flipPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("flip"), provider.wallet.publicKey.toBuffer(), Buffer.from(seed)],
        program.programId
      )

      console.log('Revealing flip with choice:', userChoice, 'nonce:', nonce.toString())

      // Call reveal_flip instruction
      const tx = await program.methods
        .revealFlip(seed, userChoice, new BN(nonce.toString()))
        .accounts({
          user: provider.wallet.publicKey,
          commitmentAccount: commitmentPda,
          flipAccount: flipPda,
          vault: vaultPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()

      // Fetch the flip result
      const flipAccount = await (program.account as any).flipAccount.fetch(flipPda)
      
      return {
        signature: tx,
        userChoice: flipAccount.userAction,
        aiChoice: flipAccount.aiAction,
        userWon: flipAccount.result.hasOwnProperty('won'),
        bidAmount: flipAccount.bid.toNumber() / web3.LAMPORTS_PER_SOL,
        timestamp: flipAccount.timestamp.toNumber()
      }
    },
    onSuccess: (result) => {
      const aiChoiceText = result.aiChoice ? 'Tails' : 'Heads'
      const userChoiceText = result.userChoice ? 'Tails' : 'Heads'
      
      if (result.userWon) {
        toast.success(`🎉 Congratulations! You Won!`, {
          description: `You chose ${userChoiceText}, AI chose ${aiChoiceText}. You won ${(result.bidAmount * 3).toFixed(3)} SOL! 💰`,
          duration: 6000,
        })
      } else {
        toast.error(`😔 You Lost This Round!`, {
          description: `You chose ${userChoiceText}, AI chose ${aiChoiceText}. You lost ${result.bidAmount.toFixed(3)} SOL. Try again!`,
          duration: 6000,
        })
      }
    },
    onError: (error) => {
      console.error('Reveal failed:', error)
      
      let errorMessage = 'Failed to reveal choice'
      let description = 'Please try again.'
      
      if (error.message.includes('AlreadyRevealed')) {
        errorMessage = 'Already Revealed'
        description = 'This commitment has already been revealed.'
      } else if (error.message.includes('CommitmentExpired')) {
        errorMessage = 'Commitment Expired'
        description = 'Your commitment has expired. Please start a new game.'
      } else if (error.message.includes('InvalidReveal')) {
        errorMessage = 'Invalid Reveal'
        description = 'The revealed choice doesn\'t match your commitment.'
      }
      
      toast.error(errorMessage, {
        description,
        duration: 5000,
      })
    },
  })
}

// Combined hook for the full flow
export function useSolflipMutation() {
  const [commitmentData, setCommitmentData] = useState<{
    nonce: bigint
    userChoice: boolean
    seed: string
  } | null>(null)
  
  const commitMutation = useCommitFlip()
  const revealMutation = useRevealFlip()
  
  const commitFlip = async ({ userChoice, bidAmount }: { userChoice: boolean; bidAmount: number }) => {
    const seed = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)))
      .map(b => (b % 36).toString(36))
      .join('')

    try {
      const result = await commitMutation.mutateAsync({
        userChoice,
        bidAmount,
        seed
      })
      
      // Store commitment data for reveal phase
      setCommitmentData({
        nonce: result.nonce,
        userChoice: result.userChoice,
        seed: result.seed
      })
      
      console.log('Commitment data stored:', {
        nonce: result.nonce,
        userChoice: result.userChoice,
        seed: result.seed
      })
      
      return result
    } catch (error) {
      console.error('Commit failed:', error)
      throw error
    }
  }
  
  const revealFlip = async (commitData?: { nonce: bigint; userChoice: boolean; seed: string }) => {
    const dataToUse = commitData || commitmentData;
    console.log('Current commitment data:', commitmentData)
    console.log('Passed commit data:', commitData)
    console.log('Data to use for reveal:', dataToUse)
    
    if (!dataToUse) {
      throw new Error('No commitment data available')
    }
    
    try {
      console.log('Revealing with data:', dataToUse)
      const result = await revealMutation.mutateAsync(dataToUse)
      setCommitmentData(null) // Clear commitment data after reveal
      return result
    } catch (error) {
      console.error('Reveal failed:', error)
      throw error
    }
  }
  
  return {
    commitFlip,
    revealFlip,
    isCommitting: commitMutation.isPending,
    isRevealing: revealMutation.isPending,
    isPending: commitMutation.isPending || revealMutation.isPending,
    hasCommitment: !!commitmentData,
    error: commitMutation.error || revealMutation.error
  }
}

export type FlipResult = {
  userChoice: boolean
  aiChoice: boolean
  userWon: boolean
  bidAmount: number
  signature: string
  timestamp: number
  commitTx?: string
  revealTx?: string
}
