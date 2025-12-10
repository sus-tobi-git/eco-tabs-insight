import { Cpu, MemoryStick, HardDrive, Wifi, Battery, MonitorSpeaker } from 'lucide-react';
import { SystemStats } from '@/types/browser';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  stats: SystemStats;
}

const getLoadColor = (value: number) => {
  if (value < 50) return 'text-success';
  if (value < 75) return 'text-warning';
  return 'text-destructive';
};

const getLoadBg = (value: number) => {
  if (value < 50) return 'bg-success';
  if (value < 75) return 'bg-warning';
  return 'bg-destructive';
};

export const StatsCard = ({ stats }: StatsCardProps) => {
  const cards = [
    {
      icon: <Cpu className="w-5 h-5" />,
      label: 'CPU',
      value: stats.cpu,
      detail: `${stats.cpuPerCore.length} cores`,
    },
    {
      icon: <MemoryStick className="w-5 h-5" />,
      label: 'RAM',
      value: stats.ram,
      detail: `${stats.ramUsed.toFixed(1)}/${stats.ramTotal}GB`,
    },
    {
      icon: <MonitorSpeaker className="w-5 h-5" />,
      label: 'GPU',
      value: stats.gpu,
      detail: 'Graphics',
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      label: 'Disk',
      value: stats.disk,
      detail: `${stats.diskUsed}/${stats.diskTotal}GB`,
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      label: 'Network',
      value: Math.min(100, (stats.network.download / 100) * 100),
      detail: `↓${stats.network.download.toFixed(1)} ↑${stats.network.upload.toFixed(1)} MB/s`,
    },
    {
      icon: <Battery className="w-5 h-5" />,
      label: 'Battery',
      value: stats.battery,
      detail: stats.onAcPower ? 'Charging' : 'On Battery',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group glass rounded-xl p-3 cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('transition-colors', getLoadColor(card.value))}>
              {card.icon}
            </div>
            <span className="text-xs font-medium text-foreground/80">{card.label}</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className={cn('h-full transition-all duration-500 rounded-full', getLoadBg(card.value))}
              style={{ width: `${card.value}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className={cn('text-lg font-display font-bold', getLoadColor(card.value))}>
              {Math.round(card.value)}%
            </span>
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {card.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
