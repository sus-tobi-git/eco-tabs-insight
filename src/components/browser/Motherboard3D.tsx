import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SystemStats } from '@/types/browser';

interface ComponentProps {
  position: [number, number, number];
  size: [number, number, number];
  load: number;
  label: string;
  detail: string;
}

const getLoadColor = (load: number): string => {
  if (load < 50) return '#00ff88';
  if (load < 75) return '#ffaa00';
  return '#ff4444';
};

const HardwareComponent = ({ position, size, load, label, detail }: ComponentProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => getLoadColor(load), [load]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.1}>
        <boxGeometry args={[size[0] * 1.1, size[1] * 1.1, size[2] * 1.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Main component */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Edge glow */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>

      {/* Label */}
      <Text
        position={[0, size[1] / 2 + 0.3, 0]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="bottom"
        font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nymCmxpmIyXjU1pg.woff2"
      >
        {label}
      </Text>

      {/* Stats display */}
      <Html position={[0, -size[1] / 2 - 0.4, 0]} center distanceFactor={10}>
        <div className="bg-background/90 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap border border-border">
          <span style={{ color }}>{Math.round(load)}%</span>
          <span className="text-muted-foreground ml-1">{detail}</span>
        </div>
      </Html>
    </group>
  );
};

const Motherboard = ({ stats }: { stats: SystemStats }) => {
  const boardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={boardRef}>
      {/* PCB Base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 5]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Circuit traces */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 7,
          -0.35,
          (Math.random() - 0.5) * 4
        ]}>
          <boxGeometry args={[Math.random() * 2 + 0.5, 0.02, 0.02]} />
          <meshStandardMaterial color="#00ff8855" emissive="#00ff88" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* CPU */}
      <HardwareComponent
        position={[-1.5, 0.2, 0]}
        size={[1.5, 0.4, 1.5]}
        load={stats.cpu}
        label="CPU"
        detail={`${stats.cpuPerCore.length} cores`}
      />

      {/* RAM Sticks */}
      <HardwareComponent
        position={[1.5, 0.15, -1]}
        size={[0.3, 0.8, 0.8]}
        load={stats.ram}
        label="RAM"
        detail={`${stats.ramUsed.toFixed(1)}GB`}
      />
      <HardwareComponent
        position={[2, 0.15, -1]}
        size={[0.3, 0.8, 0.8]}
        load={stats.ram}
        label=""
        detail=""
      />

      {/* GPU */}
      <HardwareComponent
        position={[0, 0.3, 1.5]}
        size={[2.5, 0.5, 0.8]}
        load={stats.gpu}
        label="GPU"
        detail="Graphics"
      />

      {/* SSD */}
      <HardwareComponent
        position={[3, 0.1, 0.5]}
        size={[0.8, 0.15, 0.6]}
        load={stats.disk}
        label="SSD"
        detail={`${stats.diskUsed}GB`}
      />

      {/* Network Chip */}
      <HardwareComponent
        position={[-3, 0.1, 1]}
        size={[0.5, 0.15, 0.5]}
        load={Math.min(100, stats.network.download * 10)}
        label="NET"
        detail={`${stats.network.download.toFixed(1)}MB/s`}
      />
    </group>
  );
};

interface Motherboard3DProps {
  stats: SystemStats;
}

export const Motherboard3D = ({ stats }: Motherboard3DProps) => {
  return (
    <div className="w-full h-full glass rounded-xl overflow-hidden border border-border">
      <Canvas
        camera={{ position: [5, 4, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050a0a']} />
        <fog attach="fog" args={['#050a0a', 8, 20]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ff88" />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00aaff" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.5}
          castShadow
          color="#00ff88"
        />

        <Motherboard stats={stats} />

        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Grid helper */}
        <gridHelper args={[20, 40, '#00ff8822', '#00ff8811']} position={[0, -0.6, 0]} />
      </Canvas>

      {/* Overlay info */}
      <div className="absolute top-3 left-3 text-xs font-mono text-primary/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          3D SYSTEM ANALYZER
        </div>
      </div>
    </div>
  );
};
