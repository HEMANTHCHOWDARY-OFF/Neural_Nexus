import React from 'react';
import { motion } from 'framer-motion';

// --- High Fidelity Colors & Gradients ---
// We define these once but will use local <defs> for unique gradients per component to avoid ID colissions if multiple rendered.

const COLORS = {
    trunkDark: '#1e293b',   // Slate-800
    trunkLight: '#475569',  // Slate-600
    leafBase: '#059669',    // Emerald-600
    leafMid: '#10b981',     // Emerald-500
    leafHighlight: '#6ee7b7', // Emerald-300
    magicGlow: '#34d399',   // Emerald-400
    flower: '#fbbf24',      // Amber-400
    flowerCenter: '#fffbeb' // Amber-50
};

// --- Animations ---
const float = {
    animate: { y: [-2, 2, -2] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
};

const pulse = {
    animate: { scale: [0.98, 1.02, 0.98], opacity: [0.8, 1, 0.8] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
};

const glowPulse = {
    animate: { opacity: [0.4, 0.8, 0.4] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }
};

// --- Helper Components ---
const Particles = ({ count = 5 }) => (
    <>
        {[...Array(count)].map((_, i) => (
            <motion.circle
                key={i}
                cx={50 + (Math.random() * 60 - 30)}
                cy={80 + (Math.random() * 20 - 10)}
                r={Math.random() * 1.5 + 0.5}
                fill={COLORS.magicGlow}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.8, 0], y: -40 - Math.random() * 30, x: (Math.random() * 20 - 10) }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
        ))}
    </>
);

// --- STAGES ---

// STAGE 1: MAGICAL SEED
// A complex, faceted gemstone-like seed pulsing with energy
export const LiveSeed = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
            <radialGradient id="seedGradient" cx="30%" cy="30%">
                <stop offset="0%" stopColor={COLORS.leafHighlight} />
                <stop offset="50%" stopColor={COLORS.leafMid} />
                <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
            <filter id="glowBlur">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="50" cy="85" rx="20" ry="5" fill="#020617" opacity="0.5" />

        {/* Outer Energy Field */}
        <motion.circle cx="50" cy="55" r="22" fill="none" stroke={COLORS.magicGlow} strokeWidth="1" opacity="0.3"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
        />

        {/* The Seed Body */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            {/* Main Shape - Teardrop Faceted */}
            <path d="M50,15 C50,15 25,45 25,65 C25,80 35,90 50,90 C65,90 75,80 75,65 C75,45 50,15 50,15 Z"
                fill="url(#seedGradient)" />

            {/* Shine/Highlight details */}
            <path d="M50,15 C50,15 35,45 35,60 C35,70 45,70 50,90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M50,15 C50,15 65,45 65,60 C65,70 55,70 50,90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Core Glow */}
            <motion.circle cx="50" cy="60" r="10" fill={COLORS.leafHighlight} filter="url(#glowBlur)" {...glowPulse} />
        </motion.g>

        <Particles count={8} />
    </svg>
);

// STAGE 2: LUMINOUS SPROUT
// Detailed stem with veins and multi-tone leaves
export const LiveSprout = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
            <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={COLORS.trunkDark} />
                <stop offset="100%" stopColor={COLORS.leafMid} />
            </linearGradient>
        </defs>

        {/* Ground */}
        <motion.ellipse cx="50" cy="90" rx="15" ry="4" fill="#020617" opacity="0.4"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />

        {/* Stem Group */}
        <motion.g style={{ originX: 0.5, originY: 1 }} animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>

            {/* Main Stem */}
            <path d="M50,90 Q50,70 50,50" stroke="url(#stemGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Leaf Left */}
            <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 1, originY: 1 }} x="50" y="50">
                <path d="M50,50 Q20,40 10,10 Q35,20 50,50" fill={COLORS.leafBase} stroke={COLORS.leafHighlight} strokeWidth="0.5" />
                <path d="M50,50 Q30,35 25,25" stroke={COLORS.leafHighlight} strokeWidth="0.5" fill="none" opacity="0.6" />
            </motion.g>

            {/* Leaf Right */}
            <motion.g animate={{ rotate: [5, -5, 5] }} transition={{ duration: 4, delay: 0, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0, originY: 1 }} x="50" y="50">
                <path d="M50,50 Q80,40 90,10 Q65,20 50,50" fill={COLORS.leafMid} stroke={COLORS.leafHighlight} strokeWidth="0.5" />
                <path d="M50,50 Q70,35 75,25" stroke={COLORS.leafHighlight} strokeWidth="0.5" fill="none" opacity="0.6" />
            </motion.g>

            {/* New Bud Top */}
            <motion.circle cx="50" cy="50" r="3" fill={COLORS.leafHighlight} {...pulse} />
        </motion.g>

        <Particles count={6} />
    </svg>
);

// STAGE 3: ETHEREAL SHRUB
// Complex branching and density
export const LiveShrub = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
            <radialGradient id="leafGrad">
                <stop offset="0%" stopColor={COLORS.leafHighlight} />
                <stop offset="100%" stopColor={COLORS.leafBase} />
            </radialGradient>
        </defs>

        {/* Roots/Base */}
        <path d="M45,95 Q50,90 55,95 L60,100 L40,100 Z" fill={COLORS.trunkDark} />

        {/* Branches */}
        <motion.g animate={{ skewX: [-2, 2, -2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M50,95 C50,70 30,60 20,40" stroke={COLORS.trunkDark} strokeWidth="3" fill="none" />
            <path d="M50,85 C50,70 70,60 80,45" stroke={COLORS.trunkDark} strokeWidth="3" fill="none" />
            <path d="M50,75 C50,60 50,60 45,30" stroke={COLORS.trunkDark} strokeWidth="2.5" fill="none" />

            {/* Leaf Clusters - Left */}
            <motion.ellipse cx="20" cy="40" rx="12" ry="8" fill="url(#leafGrad)" transform="rotate(-30 20 40)" {...pulse} />
            <motion.path d="M20,40 L10,30 L30,30 Z" fill={COLORS.leafMid} transform="rotate(-30 20 40)" />

            {/* Leaf Clusters - Right */}
            <motion.ellipse cx="80" cy="45" rx="14" ry="9" fill="url(#leafGrad)" transform="rotate(30 80 45)" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, delay: 1, repeat: Infinity }} />

            {/* Leaf Clusters - Top */}
            <motion.ellipse cx="45" cy="30" rx="10" ry="12" fill={COLORS.leafBase} {...float} />
            <motion.circle cx="45" cy="30" r="6" fill={COLORS.magicGlow} opacity="0.5" filter="blur(2px)" />
        </motion.g>

        <Particles count={10} />
    </svg>
);

// STAGE 4: ANCIENT TREE
// Thick twisted trunk, volumetric layers of leaves
export const LiveTree = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
            <linearGradient id="trunkGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="40%" stopColor={COLORS.trunkDark} />
                <stop offset="100%" stopColor="#334155" />
            </linearGradient>
        </defs>

        {/* Twisted Trunk */}
        <path d="M40,95 Q45,85 42,70 Q40,50 30,40 L35,40 Q50,55 50,70 Q50,55 65,40 L70,40 Q60,50 58,70 Q55,85 60,95 Z"
            fill="url(#trunkGrad)" stroke="#0f172a" strokeWidth="1" />

        {/* Roots */}
        <path d="M40,95 Q30,100 20,98" stroke={COLORS.trunkDark} strokeWidth="3" fill="none" />
        <path d="M60,95 Q70,100 80,98" stroke={COLORS.trunkDark} strokeWidth="3" fill="none" />

        {/* Canopy Layers (Back to Front) */}
        <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>

            {/* Layer 1 - Dark/Back */}
            <g opacity="0.9">
                <circle cx="25" cy="40" r="20" fill="#047857" />
                <circle cx="75" cy="40" r="20" fill="#047857" />
                <circle cx="50" cy="25" r="25" fill="#047857" />
            </g>

            {/* Layer 2 - Mid/Bright */}
            <g transform="translate(0, 5)">
                <circle cx="35" cy="35" r="18" fill={COLORS.leafBase} />
                <circle cx="65" cy="35" r="18" fill={COLORS.leafBase} />
                <circle cx="50" cy="20" r="20" fill={COLORS.leafMid} />
            </g>

            {/* Layer 3 - Highlights/Glowing */}
            <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }}>
                <circle cx="30" cy="30" r="8" fill={COLORS.leafHighlight} opacity="0.4" filter="blur(4px)" />
                <circle cx="70" cy="30" r="8" fill={COLORS.leafHighlight} opacity="0.4" filter="blur(4px)" />
                <circle cx="50" cy="15" r="10" fill={COLORS.leafHighlight} opacity="0.4" filter="blur(4px)" />
            </motion.g>
        </motion.g>

        {/* Runes/Markings on Trunk */}
        <motion.path d="M50,85 L50,75 M45,80 L55,80" stroke={COLORS.magicGlow} strokeWidth="1" opacity="0.5"
            animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />

        <Particles count={15} />
    </svg>
);

// STAGE 5: ETERNAL SPIRIT TREE
// The final form: Ascended, glowing with cosmic energy, golden roots
export const LiveEternalTree = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
            <linearGradient id="eternalTrunk" x1="0" x2="1">
                <stop offset="0%" stopColor="#78350f" /> {/* Amber-900 */}
                <stop offset="50%" stopColor="#d97706" /> {/* Amber-600 */}
                <stop offset="100%" stopColor="#f59e0b" /> {/* Amber-500 */}
            </linearGradient>
            <radialGradient id="spiritGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
            <filter id="cosmicBlur">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Radiating Energy Rings */}
        <motion.circle cx="50" cy="60" r="30" fill="none" stroke="#34d399" strokeWidth="0.5" opacity="0.3"
            animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle cx="50" cy="60" r="30" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3"
            animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Back Aura */}
        <motion.circle cx="50" cy="50" r="45" fill="url(#spiritGlow)" opacity="0.4"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Majestic Golden Trunk */}
        <path d="M40,100 Q30,90 35,70 Q30,50 25,40 L30,40 Q50,60 50,70 Q50,60 70,40 L75,40 Q70,50 65,70 Q70,90 60,100 Z"
            fill="url(#eternalTrunk)" filter="drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))" />

        {/* Roots */}
        <path d="M40,100 Q30,105 20,105" stroke="#d97706" strokeWidth="2" fill="none" />
        <path d="M60,100 Q70,105 80,105" stroke="#d97706" strokeWidth="2" fill="none" />

        {/* Spirit Canopy - Floating Layers */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            {/* Layer 1 - Deep Emerald */}
            <circle cx="25" cy="45" r="18" fill="#065f46" opacity="0.9" />
            <circle cx="75" cy="45" r="18" fill="#065f46" opacity="0.9" />
            <circle cx="50" cy="30" r="22" fill="#065f46" opacity="0.9" />

            {/* Layer 2 - Luminous Teal */}
            <g transform="translate(0, -5)">
                <motion.circle cx="35" cy="35" r="15" fill="#10b981" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                <motion.circle cx="65" cy="35" r="15" fill="#10b981" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, delay: 1, repeat: Infinity }} />
                <motion.circle cx="50" cy="20" r="18" fill="#34d399" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity }} />
            </g>

            {/* Layer 3 - Pure Light Highlights */}
            <circle cx="50" cy="20" r="8" fill="#ecfdf5" opacity="0.6" filter="blur(5px)" />
            <circle cx="35" cy="35" r="5" fill="#ecfdf5" opacity="0.6" filter="blur(5px)" />
            <circle cx="65" cy="35" r="5" fill="#ecfdf5" opacity="0.6" filter="blur(5px)" />

            {/* Eternal Fruits - Golden Apples */}
            <g transform="translate(0, -2)">
                {[
                    { x: 30, y: 40 }, { x: 70, y: 40 }, { x: 50, y: 30 },
                    { x: 20, y: 45 }, { x: 80, y: 45 }
                ].map((pos, i) => (
                    <motion.circle
                        key={`fruit-${i}`}
                        cx={pos.x} cy={pos.y} r="3"
                        fill="#fbbf24" // Amber-400
                        filter="drop-shadow(0 0 2px #d97706)"
                        animate={{ y: [0, 2, 0] }}
                        transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </g>

            {/* Spirit Flowers */}
            <g>
                {[
                    { x: 40, y: 20 }, { x: 60, y: 20 }, { x: 35, y: 50 },
                    { x: 65, y: 50 }, { x: 50, y: 40 }
                ].map((pos, i) => (
                    <motion.g
                        key={`flower-${i}`}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, delay: i * 0.7, repeat: Infinity }}
                    >
                        <circle r="3" fill="#e0f2fe" /> {/* Light Blue */}
                        <circle r="1" fill="#0ea5e9" /> {/* Sky Blue */}
                        <circle r="4" fill="#e0f2fe" opacity="0.4" filter="blur(2px)" />
                    </motion.g>
                ))}
            </g>
        </motion.g>

        {/* Floating Runes / Stars */}
        {[...Array(8)].map((_, i) => (
            <motion.text
                key={i}
                x={50} y={50}
                fontSize="4"
                fill="#fbbf24"
                style={{ fontWeight: 'bold', fontFamily: 'serif' }}
                initial={{ opacity: 0, scale: 0, x: 50 + (Math.random() * 60 - 30), y: 50 + (Math.random() * 60 - 30) }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: '-=20' }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
            >
                ✦
            </motion.text>
        ))}

        <Particles count={30} />
    </svg>
);
