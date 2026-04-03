import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// ─── Theme Palettes ───────────────────────────────────
const THEMES = {
    dark: {
        bg: '#1a1a2e',
        particleColors: ['#818cf8', '#a78bfa', '#6366f1', '#c084fc', '#38bdf8'],
        ambientIntensity: 0.3,
        pointLightColor: '#818cf8',
        pointLightIntensity: 2.5,
        mat1: { color: '#818cf8', emissive: '#6366f1', emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.9 },
        mat2: { color: '#c084fc', emissive: '#a855f7', emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.8 },
        mat3: { color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.7, roughness: 0.2, metalness: 0.85 },
    },
    light: {
        bg: '#f9fafb',
        particleColors: ['#93c5fd', '#c4b5fd', '#a5b4fc', '#d8b4fe', '#7dd3fc'],
        ambientIntensity: 0.8,
        pointLightColor: '#a5b4fc',
        pointLightIntensity: 1.0,
        mat1: { color: '#a5b4fc', emissive: '#a5b4fc', emissiveIntensity: 0.1, roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.7 },
        mat2: { color: '#d8b4fe', emissive: '#d8b4fe', emissiveIntensity: 0.1, roughness: 0.7, metalness: 0.2, transparent: true, opacity: 0.6 },
        mat3: { color: '#7dd3fc', emissive: '#7dd3fc', emissiveIntensity: 0.1, roughness: 0.5, metalness: 0.3, transparent: true, opacity: 0.65 },
    },
};

// ─── Particle Cloud ───────────────────────────────────
const PARTICLE_COUNT = 1200;

const ParticleCloud = ({ theme }) => {
    const pointsRef = useRef();
    const palette = THEMES[theme] || THEMES.dark;

    const { positions, colors, baseSizes } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const baseSizes = new Float32Array(PARTICLE_COUNT);
        const threeColors = palette.particleColors.map(c => new THREE.Color(c));

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const r = 8 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const c = threeColors[Math.floor(Math.random() * threeColors.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            baseSizes[i] = 0.03 + Math.random() * 0.08;
        }

        return { positions, colors, baseSizes };
    }, [theme]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.elapsedTime;

        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;

        const scale = 1 + Math.sin(time * 0.5) * 0.03;
        pointsRef.current.scale.set(scale, scale, scale);
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={theme === 'dark' ? 0.9 : 0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// ─── Custom Float (no drei!) ──────────────────────────
const useFloat = (ref, { speed = 1, floatY = 0.5, rotateSpeed = 0.2 }) => {
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.y += Math.sin(t * speed) * 0.002 * floatY;
        ref.current.rotation.y = t * rotateSpeed;
        ref.current.rotation.x = Math.sin(t * rotateSpeed * 0.7) * 0.15;
    });
};

// ─── Floating Atom ────────────────────────────────────
const FloatingAtom = ({ theme }) => {
    const groupRef = useRef();
    const p = THEMES[theme] || THEMES.dark;

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y = 2 + Math.sin(t * 0.8) * 0.6;
        groupRef.current.rotation.x = t * 0.3;
        groupRef.current.rotation.z = t * 0.2;
    });

    return (
        <group ref={groupRef} position={[-6, 2, -3]}>
            <mesh>
                <icosahedronGeometry args={[0.35, 1]} />
                <meshStandardMaterial {...p.mat1} />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.8, 0.02, 16, 64]} />
                <meshStandardMaterial {...p.mat2} />
            </mesh>
            <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
                <torusGeometry args={[0.9, 0.02, 16, 64]} />
                <meshStandardMaterial {...p.mat3} />
            </mesh>
        </group>
    );
};

// ─── Floating Code Bracket ────────────────────────────
const FloatingBracket = ({ theme }) => {
    const groupRef = useRef();
    const p = THEMES[theme] || THEMES.dark;

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y = -1 + Math.sin(t * 0.6) * 0.5;
        groupRef.current.rotation.y = t * 0.15;
        groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.1;
    });

    return (
        <group ref={groupRef} position={[6, -1, -4]} rotation={[0.2, -0.3, 0.1]}>
            <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial {...p.mat1} />
            </mesh>
            <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial {...p.mat1} />
            </mesh>
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial {...p.mat3} />
            </mesh>
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial {...p.mat3} />
            </mesh>
            <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
                <boxGeometry args={[0.06, 0.9, 0.06]} />
                <meshStandardMaterial {...p.mat2} />
            </mesh>
        </group>
    );
};

// ─── Floating Book ────────────────────────────────────
const FloatingBook = ({ theme }) => {
    const groupRef = useRef();
    const p = THEMES[theme] || THEMES.dark;

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y = -3.5 + Math.sin(t * 1.0) * 0.4;
        groupRef.current.rotation.y = 0.5 + Math.sin(t * 0.3) * 0.2;
    });

    return (
        <group ref={groupRef} position={[0, -3.5, -2]} rotation={[0.1, 0.5, -0.1]}>
            <mesh>
                <boxGeometry args={[0.8, 0.05, 0.6]} />
                <meshStandardMaterial {...p.mat2} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.75, 0.06, 0.55]} />
                <meshStandardMaterial color={theme === 'dark' ? '#2a2a4a' : '#e5e7eb'} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[0.8, 0.05, 0.6]} />
                <meshStandardMaterial {...p.mat1} />
            </mesh>
        </group>
    );
};

// ─── Scene ────────────────────────────────────────────
const Scene = ({ theme }) => {
    const p = THEMES[theme] || THEMES.dark;

    return (
        <>
            <ambientLight intensity={p.ambientIntensity} />
            <pointLight position={[10, 10, 10]} intensity={p.pointLightIntensity} color={p.pointLightColor} />
            <pointLight position={[-10, -5, 5]} intensity={p.pointLightIntensity * 0.5} color={theme === 'dark' ? '#c084fc' : '#d8b4fe'} />
            <ParticleCloud theme={theme} />
            <FloatingAtom theme={theme} />
            <FloatingBracket theme={theme} />
            <FloatingBook theme={theme} />
        </>
    );
};

// ─── Main Export ──────────────────────────────────────
const NeuralBackground = () => {
    const { theme } = useTheme();
    const palette = THEMES[theme] || THEMES.dark;

    return (
        <div
            className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden transition-colors duration-700"
            style={{ backgroundColor: palette.bg }}
        >
            <Suspense fallback={<div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />}>
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 1.5]}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Scene theme={theme} />
                </Canvas>
            </Suspense>
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                    backgroundImage: theme === 'dark'
                        ? `radial-gradient(ellipse at center, transparent 30%, ${palette.bg} 85%)`
                        : `radial-gradient(ellipse at center, transparent 40%, ${palette.bg} 90%)`,
                    opacity: theme === 'dark' ? 1 : 0.7,
                }}
            />
        </div>
    );
};

export default NeuralBackground;
