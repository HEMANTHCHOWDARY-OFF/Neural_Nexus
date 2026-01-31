"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ mouse }: { mouse: { x: number; y: number } }) {
    const ref = useRef<THREE.Points>(null);
    const originalPositions = useRef<Float32Array | null>(null);

    const [positions, colors] = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spread particles in a larger space
            positions[i3] = (Math.random() - 0.5) * 15;
            positions[i3 + 1] = (Math.random() - 0.5) * 15;
            positions[i3 + 2] = (Math.random() - 0.5) * 8;

            // Royal theme colors: blue, purple, gold
            const colorChoice = Math.random();
            const color = new THREE.Color();

            if (colorChoice < 0.4) {
                // Blue tones
                color.setHSL(0.6, 0.7, 0.5 + Math.random() * 0.3);
            } else if (colorChoice < 0.7) {
                // Purple tones
                color.setHSL(0.75, 0.6, 0.5 + Math.random() * 0.3);
            } else {
                // Gold/amber tones
                color.setHSL(0.12, 0.8, 0.5 + Math.random() * 0.2);
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        return [positions, colors];
    }, []);

    // Store original positions
    useEffect(() => {
        if (!originalPositions.current) {
            originalPositions.current = new Float32Array(positions);
        }
    }, [positions]);

    useFrame((state) => {
        if (ref.current && originalPositions.current) {
            // Faster rotation
            ref.current.rotation.x = state.clock.elapsedTime * 0.05;
            ref.current.rotation.y = state.clock.elapsedTime * 0.08;

            // More dynamic wave motion + mouse interaction
            const currentPositions = ref.current.geometry.attributes.position.array as Float32Array;
            const origPos = originalPositions.current;

            for (let i = 0; i < currentPositions.length; i += 3) {
                const x = origPos[i];
                const y = origPos[i + 1];
                const z = origPos[i + 2];

                // Wave motion
                const wave = Math.sin(state.clock.elapsedTime * 1.2 + x * 0.5 + z * 0.5) * 0.1;

                // Mouse interaction - particles move away from cursor
                const mouseX = mouse.x * 5;
                const mouseY = -mouse.y * 5;
                const dx = x - mouseX;
                const dy = y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 3;

                let pushX = 0;
                let pushY = 0;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.5;
                    pushX = (dx / distance) * force;
                    pushY = (dy / distance) * force;
                }

                currentPositions[i] = x + pushX;
                currentPositions[i + 1] = y + wave + pushY;
                currentPositions[i + 2] = z;
            }

            ref.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function ConnectedParticles() {
    const ref = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const count = 150;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 12;
            positions[i3 + 1] = (Math.random() - 0.5) * 12;
            positions[i3 + 2] = (Math.random() - 0.5) * 6;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create connections between nearby particles
        const indices = [];
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < 2) {
                    indices.push(i, j);
                }
            }
        }

        geometry.setIndex(indices);
        return geometry;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.04;
        }
    });

    return (
        <lineSegments ref={ref} geometry={geometry}>
            <lineBasicMaterial
                color="#6366f1"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
    return (
        <>
            <ParticleField mouse={mouse} />
            <ConnectedParticles />
        </>
    );
}

export function ThreeBackground() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouse({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: (event.clientY / window.innerHeight) * 2 - 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
            >
                <Scene mouse={mouse} />
            </Canvas>

            {/* Subtle gradient overlay to blend with design */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        </div>
    );
}
