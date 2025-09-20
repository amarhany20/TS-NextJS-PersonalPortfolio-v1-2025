"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

function Earth() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_state, delta: number) => { mesh.current.rotation.y += delta * 0.15; });
  const texture = useMemo(() => {
    // Simple procedural color via shader-like material (can be replaced with texture later)
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grd = ctx.createRadialGradient(128,128,40,128,128,120);
    grd.addColorStop(0,'#1d6fa3');
    grd.addColorStop(1,'#092235');
    ctx.fillStyle = grd; ctx.fillRect(0,0,256,256);
    return new THREE.CanvasTexture(canvas);
  }, []);
  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.05}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial color="#4dd2ff" transparent opacity={0.08} />
    </mesh>
  );
}

function Stars() {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i=0;i<count;i++) {
    const r = 6 + Math.random()*4;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(2*Math.random()-1);
    positions[i*3] = r*Math.sin(phi)*Math.cos(theta);
    positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    positions[i*3+2] = r*Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.02} color="#ffffff" />
    </points>
  );
}

export default function EarthCanvas() {
  return (
    <div className="w-full h-80 md:h-full md:min-h-[380px] rounded-lg overflow-hidden bg-[#0c1014] relative">
      <Canvas camera={{ position: [0,0,3] }} dpr={[1,2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4,3,5]} intensity={1.2} />
        <Earth />
        <Atmosphere />
        <Stars />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,214,0,0.08),transparent_60%)]" />
    </div>
  );
}
