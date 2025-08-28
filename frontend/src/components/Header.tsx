import type { FC } from 'react';
import WalletConnectBox from './WalletConnectBox';

const Header: FC = () => {
  return (
    <header className="app-header">
      <div className="flex items-center">
        {/* <div className="logo-badge">SF</div> */}
        <div className="header-meta">
          <div className="flex items-center">
            <div className="header-title">SolFlip</div>
            <div className="header-badge">Play to win • 3x</div>
          </div>
          <div className="header-sub">Fast • Fair • Playful</div>
        </div>
      </div>

      <div className="nav-controls flex items-center">
        {/* Wallet connect / status box */}

        <WalletConnectBox />
      </div>

      {/* decorative header blobs */}
      <div className="header-blob one" aria-hidden></div>
      <div className="header-blob two" aria-hidden></div>
    </header>
  );
};

export default Header;
