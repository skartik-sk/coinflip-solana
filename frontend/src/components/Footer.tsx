import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="site-footer bg-transparent border-t border-border/10">
      <div className="text-sm">&copy; 2025 SolFlip</div>
      <div className="flex gap-4">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Docs
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Discord
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
