import { BookOpen, GraduationCap, Code, Globe } from 'lucide-react';
import { BrowserMode } from '@/types/browser';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  currentMode: BrowserMode;
  onModeChange: (mode: BrowserMode) => void;
}

const modes: { id: BrowserMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'research', label: 'Research', icon: <BookOpen className="w-4 h-4" />, description: 'Optimized for reading' },
  { id: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" />, description: 'Focus & study mode' },
  { id: 'developer', label: 'Developer', icon: <Code className="w-4 h-4" />, description: 'API & docs focused' },
  { id: 'other', label: 'General', icon: <Globe className="w-4 h-4" />, description: 'Balanced defaults' },
];

export const ModeSelector = ({ currentMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex flex-col gap-2 p-3 glass rounded-xl">
      <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Mode</h3>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-left',
            currentMode === mode.id
              ? 'bg-primary/20 border border-primary text-primary glow-primary'
              : 'bg-secondary/30 border border-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground',
          )}
        >
          {mode.icon}
          <div className="flex flex-col">
            <span className="text-xs font-medium">{mode.label}</span>
            {currentMode === mode.id && (
              <span className="text-[10px] opacity-70">{mode.description}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
