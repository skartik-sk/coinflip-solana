import type { FC } from 'react';

interface GameControlsProps {
  userChoice: 'heads' | 'tails' | null;
  setUserChoice: (choice: 'heads' | 'tails') => void;
  onFlip: () => void;
  isFlipping: boolean;
  disabled?: boolean;
}

const GameControls: FC<GameControlsProps> = ({ userChoice, setUserChoice, onFlip, isFlipping, disabled = false }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Choice buttons */}
      <div className="flex gap-4 w-full">
        <button
          onClick={() => setUserChoice('heads')}
          className={`btn-fizz flex-1 px-6 py-4 rounded-2xl font-bold transition-all ${
            userChoice === 'heads' 
              ? 'btn-primary shadow-lg' 
              : 'btn-ghost hover:bg-primary/10'
          }`}
          disabled={isFlipping || disabled}
        >
          <span className="flex items-center justify-center gap-2">
            🪙 <span>Heads</span>
          </span>
        </button>
        <button
          onClick={() => setUserChoice('tails')}
          className={`btn-fizz flex-1 px-6 py-4 rounded-2xl font-bold transition-all ${
            userChoice === 'tails' 
              ? 'btn-secondary shadow-lg' 
              : 'btn-ghost hover:bg-secondary/10'
          }`}
          disabled={isFlipping || disabled}
        >
          <span className="flex items-center justify-center gap-2">
            ⚪ <span>Tails</span>
          </span>
        </button>
      </div>
      
      {/* Flip button */}
      <button
        onClick={onFlip}
        disabled={!userChoice || isFlipping || disabled}
        className={`btn-fizz w-full px-8 py-4 rounded-3xl text-lg font-bold transition-all ${
          userChoice && !isFlipping && !disabled
            ? 'btn-accent shadow-xl hover:shadow-2xl animate-glow' 
            : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
        }`}
      >
        {isFlipping ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">🎲</span> Flipping...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🚀 Start Flip
          </span>
        )}
      </button>
      
      {/* Bet info */}
      {userChoice && (
        <div className="text-center text-sm bg-card/50 rounded-lg px-4 py-2 backdrop-blur-sm border border-border/30">
          <div className="text-muted-foreground">Your bet:</div>
          <div className="font-bold text-primary">
            {userChoice} • 0.01 SOL
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
