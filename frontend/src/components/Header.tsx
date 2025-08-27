import type { FC } from 'react';
import { WalletButton, ClusterButton } from './solana/SolanaProvider';

const Header: FC = () => {
  return (
    <header className="flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-black/10 to-transparent">
      <div className="flex gap-4 items-center">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-bold text-background">
          SF
        </div>
        <div>
          <div className="font-bold text-lg">SolFlip</div>
          <div className="text-xs text-muted-foreground">Fast • Fair • Playful</div>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <ClusterButton />
        <WalletButton />
      </div>
    </header>
  );
};

export default Header;
