import type { FC } from 'react';
import { WalletButton } from './solana/SolanaProvider';

const WalletConnectBox: FC = () => {

  return (
    <div className="wallet-box glass-card flex items-center gap-3 px-3 py-2">
      <div className="wallet-status" aria-hidden>
        <span className="dot" />
        <span className="pulse" />
      </div>

    
      <div className="divider" aria-hidden />

        
        <WalletButton />
      </div>

  );
};

export default WalletConnectBox;
