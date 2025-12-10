import { useState, useEffect, useCallback } from 'react';
import { SystemStats, EcoState } from '@/types/browser';

const generateRandomVariation = (base: number, variance: number): number => {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));
};

const generateCoreStats = (baseLoad: number): number[] => {
  return Array.from({ length: 8 }, () => 
    generateRandomVariation(baseLoad, 30)
  );
};

export const useSystemStats = (pollInterval = 1500) => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 35,
    cpuPerCore: generateCoreStats(35),
    ram: 62,
    ramUsed: 10.2,
    ramTotal: 16,
    disk: 58,
    diskUsed: 465,
    diskTotal: 800,
    gpu: 25,
    network: { upload: 1.2, download: 8.5 },
    battery: 85,
    onAcPower: true,
  });

  const [ecoState, setEcoState] = useState<EcoState>('green');

  const updateStats = useCallback(() => {
    setStats(prev => {
      const newCpu = generateRandomVariation(prev.cpu, 15);
      const newRam = generateRandomVariation(prev.ram, 5);
      const newGpu = generateRandomVariation(prev.gpu, 20);
      
      return {
        cpu: newCpu,
        cpuPerCore: generateCoreStats(newCpu),
        ram: newRam,
        ramUsed: (newRam / 100) * prev.ramTotal,
        ramTotal: prev.ramTotal,
        disk: prev.disk,
        diskUsed: prev.diskUsed,
        diskTotal: prev.diskTotal,
        gpu: newGpu,
        network: {
          upload: Math.max(0, prev.network.upload + (Math.random() - 0.5) * 2),
          download: Math.max(0, prev.network.download + (Math.random() - 0.5) * 5),
        },
        battery: Math.max(0, Math.min(100, prev.battery - (prev.onAcPower ? -0.1 : 0.05))),
        onAcPower: prev.onAcPower,
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateStats, pollInterval);
    return () => clearInterval(interval);
  }, [updateStats, pollInterval]);

  useEffect(() => {
    const avgLoad = (stats.cpu + stats.ram) / 2;
    if (avgLoad < 50) {
      setEcoState('green');
    } else if (avgLoad < 75) {
      setEcoState('yellow');
    } else {
      setEcoState('red');
    }
  }, [stats.cpu, stats.ram]);

  return { stats, ecoState };
};
