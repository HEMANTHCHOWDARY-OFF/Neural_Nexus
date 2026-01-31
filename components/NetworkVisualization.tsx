"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NetworkNode({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
    );
}

function NetworkConnections({ nodes }: { nodes: Array<[number, number, number]> }) {
    const linesRef = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const positions: number[] = [];

        // Connect nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const [x1, y1, z1] = nodes[i];
                const [x2, y2, z2] = nodes[j];
                const distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) +
                    Math.pow(y2 - y1, 2) +
                    Math.pow(z2 - z1, 2)
                );

                if (distance < 2) {
                    positions.push(x1, y1, z1, x2, y2, z2);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        return geometry;
    }, [nodes]);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial color="#6366f1" transparent opacity={0.3} />
        </lineSegments>
    );
}

function HumanNetwork() {
    const groupRef = useRef<THREE.Group>(null);

    const nodes = useMemo(() => {
        const nodePositions: Array<[number, number, number]> = [];
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

        // Create a network of nodes in 3D space
        for (let i = 0; i < 20; i++) {
            const theta = (i / 20) * Math.PI * 2;
            const radius = 1.5 + Math.random() * 0.5;
            const y = (Math.random() - 0.5) * 2;

            nodePositions.push([
                Math.cos(theta) * radius,
                y,
                Math.sin(theta) * radius
            ]);
        }

        return { positions: nodePositions, colors };
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            <NetworkConnections nodes={nodes.positions} />
            {nodes.positions.map((pos, i) => (
                <NetworkNode
                    key={i}
                    position={pos}
                    color={nodes.colors[i % nodes.colors.length]}
                />
            ))}
        </group>
    );
}

export function NetworkVisualization() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                <HumanNetwork />
            </Canvas>
        </div>
    );
}
