import { Plus, Pin, X } from 'lucide-react';
import { Tab, TabPriority } from '@/types/browser';
import { cn } from '@/lib/utils';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onAddTab: () => void;
  onCloseTab: (tabId: string) => void;
  onTogglePin: (tabId: string) => void;
}

const priorityColors: Record<TabPriority, string> = {
  high: 'bg-success/20 border-success text-success',
  medium: 'bg-warning/20 border-warning text-warning',
  low: 'bg-destructive/20 border-destructive text-destructive',
};

const priorityGlow: Record<TabPriority, string> = {
  high: 'glow-primary',
  medium: 'glow-warning',
  low: 'glow-danger',
};

export const TabBar = ({
  tabs,
  activeTabId,
  onTabClick,
  onAddTab,
  onCloseTab,
  onTogglePin,
}: TabBarProps) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-card/50 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={cn(
            'group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300',
            'border min-w-[140px] max-w-[200px]',
            tab.id === activeTabId
              ? 'bg-primary/10 border-primary ' + priorityGlow[tab.priority]
              : 'bg-secondary/30 border-border hover:bg-secondary/50 hover:border-muted-foreground',
          )}
        >
          {/* Priority indicator */}
          <div className={cn(
            'absolute top-0 left-0 w-full h-0.5 rounded-t-lg',
            tab.priority === 'high' && 'bg-success',
            tab.priority === 'medium' && 'bg-warning',
            tab.priority === 'low' && 'bg-destructive',
          )} />

          {/* Pin indicator */}
          {tab.pinned && (
            <Pin className="w-3 h-3 text-primary shrink-0" />
          )}

          {/* Tab title */}
          <span className="text-xs truncate text-foreground/90">
            {tab.title}
          </span>

          {/* Score badge */}
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full border shrink-0',
            priorityColors[tab.priority],
          )}>
            {Math.round(tab.score)}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(tab.id);
              }}
              className="p-0.5 hover:bg-primary/20 rounded transition-colors"
            >
              <Pin className={cn('w-3 h-3', tab.pinned ? 'text-primary' : 'text-muted-foreground')} />
            </button>
            {!tab.pinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-0.5 hover:bg-destructive/20 rounded transition-colors"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Tab Button */}
      <button
        onClick={onAddTab}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary transition-all duration-300 glow-primary shrink-0"
      >
        <Plus className="w-4 h-4 text-primary" />
      </button>
    </div>
  );
};
