import type { FC } from 'react';

interface CoinProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
  isWin?: boolean;
}

const Coin: FC<CoinProps> = ({ isFlipping, result, isWin = false }) => {
  const getCoinClasses = () => {
    let classes = '';
    if (isFlipping) classes += ' flipping';
    if (result === 'heads') classes += ' heads';
    if (result === 'tails') classes += ' tails';
    if (isWin) classes += ' glow-win';
    return classes;
  };

  return (
    <div className=" flex justify-center items-center h-48 md:h-56">
      <div style={{ position: 'relative' }}>
        <div className={getCoinClasses()}>
        {!isFlipping && result && (
          <span className="text-[10rem] animate-pulse">
            {result === 'heads' ? '🪙' : '⚪'}
          </span>
        )}
        {isFlipping && (
          <span className="text-[10rem] font-bold animate-pulse">
            🌟
          </span>
        )}
        {!isFlipping && !result && (
          <span className="text-[10rem] font-bold opacity-50">
            🪙
          </span>
        )}
        </div>

      
      </div>
    </div>
  );
};

export default Coin;
