import { Leaf, AlertTriangle, Flame } from 'lucide-react';
import { EcoState } from '@/types/browser';
import { cn } from '@/lib/utils';

interface EcoIndicatorProps {
  ecoState: EcoState;
  cpuUsage: number;
  ramUsage: number;
}

const stateConfig: Record<EcoState, { icon: React.ReactNode; label: string; color: string; glow: string }> = {
  green: {
    icon: <Leaf className="w-5 h-5" />,
    label: 'ECO',
    color: 'text-success bg-success/20 border-success',
    glow: 'glow-primary',
  },
  yellow: {
    icon: <AlertTriangle className="w-5 h-5" />,
    label: 'MODERATE',
    color: 'text-warning bg-warning/20 border-warning',
    glow: 'glow-warning',
  },
  red: {
    icon: <Flame className="w-5 h-5" />,
    label: 'HIGH LOAD',
    color: 'text-destructive bg-destructive/20 border-destructive',
    glow: 'glow-danger',
  },
};

export const EcoIndicator = ({ ecoState, cpuUsage, ramUsage }: EcoIndicatorProps) => {
  const config = stateConfig[ecoState];

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2 rounded-xl border animate-pulse-glow',
      config.color,
      config.glow,
    )}>
      <div className="flex items-center gap-2">
        {config.icon}
        <span className="text-xs font-display font-bold tracking-wider">{config.label}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] opacity-80">
        <span>CPU: {Math.round(cpuUsage)}%</span>
        <span>•</span>
        <span>RAM: {Math.round(ramUsage)}%</span>
      </div>
    </div>
  );
};
