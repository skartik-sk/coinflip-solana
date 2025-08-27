import type { FC } from 'react';
import { useEffect, useState } from 'react';

const colors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))', 
  'hsl(var(--accent))',
  '#fbbf24', // Gold
  '#f59e0b', // Yellow
  '#22c55e', // Green
];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface ConfettiPiece {
  left: string;
  top: string;
  bg: string;
  delay: number;
  duration: number;
  rotate: number;
}

const Confetti: FC<{ play: boolean }> = ({ play }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!play) {
      setPieces([]);
      return;
    }

    const count = 50;
    const newPieces = Array.from({ length: count }).map((): ConfettiPiece => ({
      left: random(0, 100) + '%',
      top: random(-20, 0) + 'vh',
      bg: colors[Math.floor(Math.random() * colors.length)],
      delay: random(0, 0.8),
      duration: random(2, 3.5),
      rotate: random(0, 360),
    }));
    
    setPieces(newPieces);
    
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, [play]);

  if (!pieces.length) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className="confetti-piece"
          style={{
            left: piece.left,
            top: piece.top,
            backgroundColor: piece.bg,
            animationDuration: piece.duration + 's',
            animationDelay: piece.delay + 's',
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
