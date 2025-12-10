export type BrowserMode = 'research' | 'student' | 'developer' | 'other';
export type TabPriority = 'high' | 'medium' | 'low';
export type EcoState = 'green' | 'yellow' | 'red';

export interface Tab {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  lastActiveAt: Date;
  totalActiveTime: number;
  interactionCount: number;
  score: number;
  priority: TabPriority;
  mode: BrowserMode;
  pinned: boolean;
  favicon?: string;
}

export interface SystemStats {
  cpu: number;
  cpuPerCore: number[];
  ram: number;
  ramUsed: number;
  ramTotal: number;
  disk: number;
  diskUsed: number;
  diskTotal: number;
  gpu: number;
  network: {
    upload: number;
    download: number;
  };
  battery: number;
  onAcPower: boolean;
}

export interface AutoCloseSettings {
  enabled: boolean;
  maxTabs: number;
  minScoreThreshold: number;
  cpuThreshold: number;
  ramThreshold: number;
}
