import type { FC } from 'react';
import { useState } from 'react';
import { useWalletUi } from '@wallet-ui/react';
import Coin from '../components/Coin';
import GameControls from '../components/GameControls';
import { useSolflipMutation, type FlipResult } from '../hooks/useSolflipProgram';
import Confetti from '../components/Confetti';
import { ResultDisplay } from '../components/ResultDisplay';

const HomeView: FC = () => {
  const [userChoice, setUserChoice] = useState<'heads' | 'tails' | null>(null);
  const [result, setResult] = useState<FlipResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { wallet } = useWalletUi();
  const flipMutation = useSolflipMutation();

  const handleFlip = async () => {
    if (!wallet || !userChoice) return;

    setShowResult(false);
    setResult(null);

    try {
      // Convert user choice to boolean (false = heads, true = tails)
      const userAction = userChoice === 'tails';
      
      // Set bid amount (0.01 SOL)
      const bidAmount = 0.01;

      console.log('Starting flip with:', { userChoice, userAction, bidAmount });

      const flipResult = await flipMutation.mutateAsync({
        userChoice: userAction,
        bidAmount
      });

      console.log('Flip completed:', flipResult);

      // Wait for coin animation to complete
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setResult(flipResult);
      setShowResult(true);

    } catch (error) {
      console.error('Flip failed:', error);
      // Error is already handled by the mutation's onError
    }
  };

  const resetGame = () => {
    setResult(null);
    setShowResult(false);
    setUserChoice(null);
  };

  const coinResult = result ? (result.aiChoice ? 'tails' : 'heads') : null;
  const isWin = result?.userWon || false;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-blob"></div>
        <div className="bg-blob"></div>
        <div className="bg-blob"></div>
      </div>

      <div className="play-card">
        <div className="hero">
          <div className="left">
            <h2>Flip for Fun — Win for Glory</h2>
            <p className="lead">
              A blazing-fast Solana-powered coin flip game. Connect your wallet, 
              place your bet, and let fortune decide your fate!
            </p>

            <div className="hero .ctas">
              {!wallet ? (
                <div className="text-center">
                  <p className="text-amber-400 mb-4">🔗 Connect your wallet to start playing!</p>
                </div>
              ) : (
                <div className="feature-grid">
                  <div className="feature-item">
                    <span>⚡</span>
                    <span>Lightning Fast</span>
                  </div>
                  <div className="feature-item">
                    <span>🔒</span>
                    <span>Secure & Fair</span>
                  </div>
                  <div className="feature-item">
                    <span>�</span>
                    <span>3x Payouts</span>
                  </div>
                  <div className="feature-item">
                    <span>�</span>
                    <span>On-Chain Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Coin 
              isFlipping={flipMutation.isPending} 
              result={coinResult} 
              isWin={isWin} 
            />
          </div>
        </div>

        {wallet && (
          <div className="w-full mt-8 flex justify-center">
            <GameControls
              userChoice={userChoice}
              setUserChoice={setUserChoice}
              onFlip={handleFlip}
              isFlipping={flipMutation.isPending}
              disabled={!wallet}
            />
          </div>
        )}

        {/* Result Display */}
        <ResultDisplay result={result} isVisible={showResult} />

        {/* Play Again Button */}
        {showResult && (
          <div className="mt-6 text-center">
            <button
              onClick={resetGame}
              className="btn-primary btn-fizz px-8 py-3"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {flipMutation.isPending && (
          <div className="mt-6 text-center">
            <div className="glass-card p-4 max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-primary font-medium">
                  Processing on Solana...
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your flip is being confirmed on-chain
              </p>
            </div>
          </div>
        )}

        {/* Wallet Status */}
        {!wallet && (
          <div className="mt-6 text-center">
            <div className="glass-card p-6 max-w-sm mx-auto">
              <div className="text-2xl mb-2">👛</div>
              <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect a Solana wallet to start playing and winning SOL!
              </p>
            </div>
          </div>
        )}
      </div>

      <Confetti play={isWin && showResult} />
    </div>
  );
};

export default HomeView;