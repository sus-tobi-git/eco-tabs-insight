import { useState, useCallback, useEffect } from 'react';
import { Tab, BrowserMode, TabPriority, AutoCloseSettings, SystemStats, EcoState } from '@/types/browser';

const generateId = () => Math.random().toString(36).substring(2, 9);

const calculatePriority = (score: number, allScores: number[]): TabPriority => {
  const sorted = [...allScores].sort((a, b) => b - a);
  const topThreshold = sorted[Math.floor(sorted.length * 0.3)] || 0;
  const bottomThreshold = sorted[Math.floor(sorted.length * 0.7)] || 0;
  
  if (score >= topThreshold) return 'high';
  if (score <= bottomThreshold) return 'low';
  return 'medium';
};

const defaultTabs: Tab[] = [
  {
    id: generateId(),
    title: 'Green Browser Home',
    url: 'green://home',
    createdAt: new Date(),
    lastActiveAt: new Date(),
    totalActiveTime: 120,
    interactionCount: 15,
    score: 85,
    priority: 'high',
    mode: 'other',
    pinned: true,
  },
  {
    id: generateId(),
    title: 'System Documentation',
    url: 'green://docs',
    createdAt: new Date(Date.now() - 300000),
    lastActiveAt: new Date(Date.now() - 60000),
    totalActiveTime: 45,
    interactionCount: 8,
    score: 62,
    priority: 'medium',
    mode: 'developer',
    pinned: false,
  },
  {
    id: generateId(),
    title: 'Research Notes',
    url: 'green://notes',
    createdAt: new Date(Date.now() - 600000),
    lastActiveAt: new Date(Date.now() - 180000),
    totalActiveTime: 30,
    interactionCount: 5,
    score: 45,
    priority: 'low',
    mode: 'research',
    pinned: false,
  },
];

export const useTabManager = (
  stats: SystemStats,
  ecoState: EcoState,
  globalMode: BrowserMode
) => {
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabs[0].id);
  const [autoCloseSettings, setAutoCloseSettings] = useState<AutoCloseSettings>({
    enabled: true,
    maxTabs: 15,
    minScoreThreshold: 20,
    cpuThreshold: 85,
    ramThreshold: 90,
  });

  // Score decay for inactive tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setTabs(prev => {
        const allScores = prev.map(t => t.score);
        return prev.map(tab => {
          const isActive = tab.id === activeTabId;
          let newScore = tab.score;
          
          if (isActive) {
            newScore = Math.min(100, tab.score + 0.5);
          } else {
            // Decay based on mode
            const decayRate = tab.mode === 'research' ? 0.1 : 
                              tab.mode === 'student' ? 0.15 : 
                              tab.mode === 'developer' ? 0.2 : 0.25;
            newScore = Math.max(0, tab.score - decayRate);
          }

          return {
            ...tab,
            score: newScore,
            totalActiveTime: isActive ? tab.totalActiveTime + 1 : tab.totalActiveTime,
            lastActiveAt: isActive ? new Date() : tab.lastActiveAt,
            priority: calculatePriority(newScore, allScores),
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTabId]);

  // Auto-close logic
  useEffect(() => {
    if (!autoCloseSettings.enabled) return;

    const shouldAutoClose = 
      tabs.length > autoCloseSettings.maxTabs ||
      stats.cpu > autoCloseSettings.cpuThreshold ||
      stats.ram > autoCloseSettings.ramThreshold;

    if (shouldAutoClose) {
      const closableTabs = tabs
        .filter(t => !t.pinned && t.priority === 'low' && t.score < autoCloseSettings.minScoreThreshold)
        .sort((a, b) => a.score - b.score);

      if (closableTabs.length > 0) {
        setTabs(prev => prev.filter(t => t.id !== closableTabs[0].id));
      }
    }
  }, [tabs, stats, autoCloseSettings]);

  const addTab = useCallback((title?: string) => {
    const newTab: Tab = {
      id: generateId(),
      title: title || `New Tab ${tabs.length + 1}`,
      url: 'green://new',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      totalActiveTime: 0,
      interactionCount: 0,
      score: 50,
      priority: 'medium',
      mode: globalMode,
      pinned: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length, globalMode]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId && filtered.length > 0) {
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const togglePin = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, pinned: !t.pinned } : t
    ));
  }, []);

  const recordInteraction = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { 
        ...t, 
        interactionCount: t.interactionCount + 1,
        score: Math.min(100, t.score + 2),
      } : t
    ));
  }, []);

  const updateTabMode = useCallback((tabId: string, mode: BrowserMode) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, mode } : t
    ));
  }, []);

  return {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    togglePin,
    recordInteraction,
    updateTabMode,
    autoCloseSettings,
    setAutoCloseSettings,
  };
};
