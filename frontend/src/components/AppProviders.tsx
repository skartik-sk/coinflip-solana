import { ReactQueryProvider } from './ReactQueryProvider'
import { SolanaProvider } from './solana/SolanaProvider'
import { ThemeProvider } from './ThemeProvider'
import type { ReactNode } from 'react'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <SolanaProvider>{children}</SolanaProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
