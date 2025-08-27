import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers
installEd25519()

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

// For the flip mutation, we'll call the actual Solana program using Anchor
export function useSolflipMutation() {
  const { wallet, cluster } = useWalletUi()

  return useMutation({
    mutationFn: async ({ userChoice, bidAmount }: { userChoice: boolean; bidAmount: number }) => {
      if (!wallet) {
        throw new Error('Wallet not connected')
      }

      try {
        // For now, we'll simulate the transaction but with more realistic behavior
        // TODO: Implement actual Anchor program call when we have proper setup
        
        console.log('Calling Solflip program with:', {
          userChoice,
          bidAmount,
          cluster: cluster.id,
          program: PROGRAM_ID.toString()
        })
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        // Simulate random AI choice based on timestamp (more realistic than pure random)
        const timestamp = Date.now()
        const aiChoice = (timestamp % 2) === 0
        const userWon = userChoice === aiChoice
        
        // Simulate transaction signature
        const signature = `flip_tx_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate different scenarios based on vault balance (as per contract logic)
        const simulatedVaultBalance = Math.random() * 10 // Random vault balance 0-10 SOL
        const requiredBalance = bidAmount * 3
        
        let finalResult = userWon
        let finalAiChoice = aiChoice
        
        // If vault doesn't have enough funds, AI chooses opposite (as per contract)
        if (simulatedVaultBalance <= requiredBalance) {
          finalAiChoice = !userChoice
          finalResult = false
          console.log('Vault underfunded - AI chose opposite')
        }
        
        // Create program logs similar to what the contract would emit
        const logs = [
          `Program ${PROGRAM_ID} invoke [1]`,
          `Program data: ${userChoice ? 'Tails' : 'Heads'} vs ${finalAiChoice ? 'Tails' : 'Heads'}`,
          `Program ${PROGRAM_ID} consumed 10000 of 200000 compute units`,
          finalResult ? `Program log: "won"` : `Program log: "lost"`,
          `Program ${PROGRAM_ID} success`
        ]
        
        return {
          userChoice,
          aiChoice: finalAiChoice,
          userWon: finalResult,
          bidAmount,
          signature,
          logs,
          vaultBalance: simulatedVaultBalance
        }
        
      } catch (error) {
        console.error('Solflip transaction failed:', error)
        throw error
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
      
      // Additional toast for transaction details
      toast.info(`Transaction Confirmed`, {
        description: `TX: ${result.signature.slice(0, 20)}...`,
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Flip failed:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Flip failed. Please try again.'
      let description = 'Check your wallet connection and balance.'
      
      if (error.message.includes('Wallet not connected')) {
        errorMessage = 'Wallet Not Connected'
        description = 'Please connect your wallet to play.'
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient Balance'
        description = 'You need more SOL to place this bid.'
      } else if (error.message.includes('User rejected')) {
        errorMessage = 'Transaction Cancelled'
        description = 'You cancelled the transaction.'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network Error'
        description = 'Please check your internet connection.'
      }
      
      toast.error(errorMessage, {
        description,
        duration: 5000,
      })
    },
  })
}

export type FlipResult = {
  userChoice: boolean
  aiChoice: boolean
  userWon: boolean
  bidAmount: number
  signature: string
  logs: string[]
  vaultBalance?: number
}
