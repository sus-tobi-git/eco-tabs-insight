import { Settings, Power } from 'lucide-react';
import { AutoCloseSettings } from '@/types/browser';
import { cn } from '@/lib/utils';

interface AutoClosePanelProps {
  settings: AutoCloseSettings;
  onSettingsChange: (settings: AutoCloseSettings) => void;
  tabCount: number;
}

export const AutoClosePanel = ({ settings, onSettingsChange, tabCount }: AutoClosePanelProps) => {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Auto-Close</h3>
        </div>
        <button
          onClick={() => onSettingsChange({ ...settings, enabled: !settings.enabled })}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
            settings.enabled
              ? 'bg-primary/20 text-primary border border-primary'
              : 'bg-secondary/30 text-muted-foreground border border-transparent',
          )}
        >
          <Power className="w-3 h-3" />
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tabs</span>
          <span className={cn(
            'font-mono',
            tabCount > settings.maxTabs ? 'text-destructive' : 'text-foreground'
          )}>
            {tabCount}/{settings.maxTabs}
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground">Max Tabs</label>
          <input
            type="range"
            min="5"
            max="30"
            value={settings.maxTabs}
            onChange={(e) => onSettingsChange({ ...settings, maxTabs: Number(e.target.value) })}
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground">Min Score: {settings.minScoreThreshold}</label>
          <input
            type="range"
            min="0"
            max="50"
            value={settings.minScoreThreshold}
            onChange={(e) => onSettingsChange({ ...settings, minScoreThreshold: Number(e.target.value) })}
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="text-[10px] text-muted-foreground/70 pt-2 border-t border-border">
          Low-priority unpinned tabs below threshold will auto-close when limits are exceeded.
        </div>
      </div>
    </div>
  );
};
