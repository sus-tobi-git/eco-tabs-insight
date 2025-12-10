import { useState } from 'react';
import { BrowserMode } from '@/types/browser';
import { useSystemStats } from '@/hooks/useSystemStats';
import { useTabManager } from '@/hooks/useTabManager';
import { TabBar } from '@/components/browser/TabBar';
import { ModeSelector } from '@/components/browser/ModeSelector';
import { EcoIndicator } from '@/components/browser/EcoIndicator';
import { StatsCard } from '@/components/browser/StatsCard';
import { Motherboard3D } from '@/components/browser/Motherboard3D';
import { AutoClosePanel } from '@/components/browser/AutoClosePanel';
import { TabContent } from '@/components/browser/TabContent';
import { Monitor, Layers3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [globalMode, setGlobalMode] = useState<BrowserMode>('other');
  const [view3D, setView3D] = useState(true);
  
  const { stats, ecoState } = useSystemStats();
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    togglePin,
    recordInteraction,
    autoCloseSettings,
    setAutoCloseSettings,
  } = useTabManager(stats, ecoState, globalMode);

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
            <span className="text-xl font-display font-bold text-primary">G</span>
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground text-glow">GREEN BROWSER</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Smart Tab Management</p>
          </div>
        </div>

        <EcoIndicator ecoState={ecoState} cpuUsage={stats.cpu} ramUsage={stats.ram} />

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView3D(false)}
            className={cn(
              'p-2 rounded-lg transition-all',
              !view3D ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView3D(true)}
            className={cn(
              'p-2 rounded-lg transition-all',
              view3D ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers3 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onAddTab={() => addTab()}
        onCloseTab={closeTab}
        onTogglePin={togglePin}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 p-3 space-y-3 border-r border-border overflow-y-auto">
          <ModeSelector currentMode={globalMode} onModeChange={setGlobalMode} />
          <AutoClosePanel
            settings={autoCloseSettings}
            onSettingsChange={setAutoCloseSettings}
            tabCount={tabs.length}
          />
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <TabContent 
              tab={activeTab} 
              onInteraction={() => activeTab && recordInteraction(activeTab.id)} 
            />
          </div>

          {/* Bottom Panel - Stats/3D */}
          <div className="h-64 border-t border-border p-3">
            {view3D ? (
              <Motherboard3D stats={stats} />
            ) : (
              <StatsCard stats={stats} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
