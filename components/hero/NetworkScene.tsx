"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Pulse = { a: number; b: number; t: number; speed: number };

/**
 * Builds the distributed-node graph exactly as the prototype does:
 * ~130 nodes on a rough spherical shell, edges between nearby nodes
 * (capped at 4/node), and ~46 pulses that travel along those edges.
 */
function buildNetwork() {
  const N = 130;
  const nodePos: THREE.Vector3[] = [];
  const posArr = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const r = 2.4 + Math.random() * 2.2; // rough spherical shell
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(p) * Math.cos(t);
    const y = r * Math.sin(p) * Math.sin(t);
    const z = r * Math.cos(p);
    nodePos.push(new THREE.Vector3(x, y, z));
    posArr[i * 3] = x;
    posArr[i * 3 + 1] = y;
    posArr[i * 3 + 2] = z;
  }

  // edges: connect nearby nodes with capped degree so the graph stays legible
  const edgeList: [number, number][] = [];
  const linePos: number[] = [];
  const maxDist = 1.7;
  const maxEdgesPerNode = 4;
  const degree = new Array<number>(N).fill(0);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (degree[i] >= maxEdgesPerNode) break;
      if (degree[j] >= maxEdgesPerNode) continue;
      if (nodePos[i].distanceTo(nodePos[j]) < maxDist) {
        linePos.push(
          nodePos[i].x, nodePos[i].y, nodePos[i].z,
          nodePos[j].x, nodePos[j].y, nodePos[j].z,
        );
        edgeList.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  // pulses: bright dots traveling along edges (transactions / signal propagation)
  const PULSES = Math.min(46, edgeList.length);
  const pulses: Pulse[] = [];
  const pulsePos = new Float32Array(PULSES * 3);
  for (let k = 0; k < PULSES; k++) {
    const e = edgeList[Math.floor(Math.random() * edgeList.length)];
    const pulse: Pulse = {
      a: e[0],
      b: e[1],
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.01,
    };
    pulses.push(pulse);
    // seed an initial position so a static (reduced-motion) frame looks alive
    const a = nodePos[pulse.a];
    const b = nodePos[pulse.b];
    pulsePos[k * 3] = a.x + (b.x - a.x) * pulse.t;
    pulsePos[k * 3 + 1] = a.y + (b.y - a.y) * pulse.t;
    pulsePos[k * 3 + 2] = a.z + (b.z - a.z) * pulse.t;
  }

  return {
    nodeGeoPos: posArr,
    linePos: new Float32Array(linePos),
    edgeList,
    nodePos,
    pulses,
    pulsePos,
  };
}

export default function NetworkScene({ animate }: { animate: boolean }) {
  const net = useMemo(buildNetwork, []);
  const groupRef = useRef<THREE.Group>(null);
  const pulseGeoRef = useRef<THREE.BufferGeometry>(null);
  const { camera } = useThree();

  // pointer parallax — track in a ref to match the prototype's easing exactly
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [animate]);

  useFrame(() => {
    if (!animate) return;
    const group = groupRef.current;
    target.current.x += (mouse.current.x - target.current.x) * 0.05;
    target.current.y += (mouse.current.y - target.current.y) * 0.05;

    if (group) {
      group.rotation.y += 0.0016;
      group.rotation.x += 0.0007;
      group.rotation.y += target.current.x * 0.0006;
      group.rotation.x += target.current.y * 0.0006;
    }

    // advance signal pulses along their edges
    const arr = net.pulsePos;
    for (let k = 0; k < net.pulses.length; k++) {
      const pu = net.pulses[k];
      pu.t += pu.speed;
      if (pu.t >= 1) {
        const e = net.edgeList[Math.floor(Math.random() * net.edgeList.length)];
        pu.a = e[0];
        pu.b = e[1];
        pu.t = 0;
        pu.speed = 0.004 + Math.random() * 0.01;
      }
      const a = net.nodePos[pu.a];
      const b = net.nodePos[pu.b];
      arr[k * 3] = a.x + (b.x - a.x) * pu.t;
      arr[k * 3 + 1] = a.y + (b.y - a.y) * pu.t;
      arr[k * 3 + 2] = a.z + (b.z - a.z) * pu.t;
    }
    if (pulseGeoRef.current) {
      pulseGeoRef.current.attributes.position.needsUpdate = true;
    }

    camera.position.x += (target.current.x * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (-target.current.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* nodes (validators / neurons) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[net.nodeGeoPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0x22d3ee}
          size={0.09}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[net.linePos, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0x6366f1} transparent opacity={0.22} />
      </lineSegments>

      {/* pulses */}
      <points>
        <bufferGeometry ref={pulseGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[net.pulsePos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xc084fc}
          size={0.13}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
