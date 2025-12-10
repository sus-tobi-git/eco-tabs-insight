import { Tab } from '@/types/browser';
import { BookOpen, GraduationCap, Code, Globe, Clock, MousePointer, Trophy } from 'lucide-react';

interface TabContentProps {
  tab: Tab | undefined;
  onInteraction: () => void;
}

const modeIcons = {
  research: <BookOpen className="w-6 h-6" />,
  student: <GraduationCap className="w-6 h-6" />,
  developer: <Code className="w-6 h-6" />,
  other: <Globe className="w-6 h-6" />,
};

const modeMessages = {
  research: 'Research Mode: Optimized for deep reading and source management.',
  student: 'Student Mode: Focus timer and study tools active.',
  developer: 'Developer Mode: API docs and network monitoring prioritized.',
  other: 'General Mode: Balanced tab management.',
};

export const TabContent = ({ tab, onInteraction }: TabContentProps) => {
  if (!tab) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No tab selected
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div 
      className="h-full p-6 overflow-auto grid-bg"
      onClick={onInteraction}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass rounded-2xl p-6 glow-primary">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              {modeIcons[tab.mode]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-display font-bold text-foreground mb-1">{tab.title}</h1>
              <p className="text-sm text-muted-foreground">{modeMessages[tab.mode]}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-foreground">{Math.round(tab.score)}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-foreground">{formatTime(tab.totalActiveTime)}</div>
            <div className="text-xs text-muted-foreground">Active Time</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <MousePointer className="w-5 h-5 text-warning mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-foreground">{tab.interactionCount}</div>
            <div className="text-xs text-muted-foreground">Interactions</div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="glass rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-display text-muted-foreground uppercase tracking-wider">Tab Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <span className={`ml-2 capitalize ${
                tab.priority === 'high' ? 'text-success' :
                tab.priority === 'medium' ? 'text-warning' : 'text-destructive'
              }`}>{tab.priority}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pinned:</span>
              <span className="ml-2 text-foreground">{tab.pinned ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">URL:</span>
              <span className="ml-2 text-primary font-mono text-xs">{tab.url}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 text-foreground">{tab.createdAt.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Interaction hint */}
        <div className="text-center text-xs text-muted-foreground/50">
          Click anywhere to record interaction & boost score
        </div>
      </div>
    </div>
  );
};
