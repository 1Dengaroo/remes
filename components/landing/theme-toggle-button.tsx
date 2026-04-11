import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleButtonProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeToggleButton({ theme, onToggle }: ThemeToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="rounded-lg bg-(--accent) text-(--accent-foreground) hover:bg-(--accent)/80 hover:text-(--accent-foreground)"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  );
}
