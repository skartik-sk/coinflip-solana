
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import type { AnchorWallet } from '@solana/wallet-adapter-react'
import {

  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {  useCallback } from 'react'
import type {ReactNode} from 'react'
import '@solana/wallet-adapter-react-ui/styles.css';
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui'

export const WalletButton = WalletMultiButton;
export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = "https://api.devnet.solana.com"
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}