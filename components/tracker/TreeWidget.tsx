"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useUserStats } from '@/hooks/useUserStats';
import { getLevelInfo } from '@/lib/tracker/levelSystem';
import { LiveSeed, LiveSprout, LiveShrub, LiveTree, LiveEternalTree } from './LiveTreeStages';
import confetti from 'canvas-confetti';

const AnimatedCounter = ({ value }: { value: number }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
};

const TreeWidget = () => {
    const [userId, setUserId] = React.useState<string | null>(null);
    const [showReward, setShowReward] = useState<{ show: boolean, amount: number }>({ show: false, amount: 0 });
    const prevXpRef = useRef<number | null>(null);

    useEffect(() => {
        setUserId(localStorage.getItem('nexus_user_id'));
    }, []);

    const { stats } = useUserStats(userId);
    const levelInfo = getLevelInfo(stats.xp);

    // XP Gain Detection & Animation Trigger
    useEffect(() => {
        if (stats.xp > 0) {
            if (prevXpRef.current !== null && stats.xp > prevXpRef.current) {
                const diff = stats.xp - prevXpRef.current;
                triggerReward(diff);
            }
            prevXpRef.current = stats.xp;
        }
    }, [stats.xp]);

    const triggerReward = (amount: number) => {
        setShowReward({ show: true, amount });

        // Confetti Explosion
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });

        // Hide message after delay
        setTimeout(() => {
            setShowReward({ show: false, amount: 0 });
        }, 3000);
    };

    const getLiveTree = () => {
        switch (levelInfo.iconType) {
            case 'seed': return <LiveSeed />;
            case 'sprout': return <LiveSprout />;
            case 'shrub': return <LiveShrub />;
            case 'trees': return <LiveTree />;
            case 'flower': return <LiveEternalTree />;
            default: return <LiveSeed />;
        }
    };

    // Animation Variants
    const containerVariants = {
        hover: { scale: 1.01, transition: { type: "spring" as const, stiffness: 300 } }
    };

    const treeContainerVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8 }
        },
        pulse: {
            scale: [1, 1.05, 1],
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="tracker-card relative"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                gap: '1.5rem',
                minHeight: '500px', // Tall hero card
                overflow: 'visible' // Allow confetti/popups to escape visually if needed (though confetti is canvas)
            }}
            variants={containerVariants}
            whileHover="hover"
            layout="position"
        >
            {/* Reward Popup Message */}
            <AnimatePresence>
                {showReward.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: -50, scale: 1.1 }}
                        exit={{ opacity: 0, y: -100, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="absolute z-50 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-xl pointer-events-none"
                        style={{ top: '40%' }}
                    >
                        <span>🎉 Great job! +{showReward.amount} XP</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Info */}
            <div className="text-center space-y-2 z-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    {levelInfo.name}
                </h2>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">
                    Level {levelInfo.level}
                </p>
            </div>

            {/* Tree Hero Section */}
            <div className="relative w-full flex justify-center items-center py-4">
                {/* Background Glow */}
                <motion.div
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: '220px',
                        height: '220px',
                        background: 'radial-gradient(circle, var(--tr-accent) 0%, transparent 70%)',
                        opacity: 0.2,
                        zIndex: 0
                    }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* The Tree */}
                <motion.div
                    key={levelInfo.iconType}
                    variants={treeContainerVariants}
                    initial="initial"
                    animate={showReward.show ? "pulse" : "animate"}
                    whileHover={{ y: -5, scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                    className="relative z-10 w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl cursor-pointer"
                >
                    {getLiveTree()}
                </motion.div>
            </div>

            {/* Progress & Stats Footer */}
            <div className="w-full max-w-md space-y-4 z-10 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground font-medium">Current XP</span>
                        <div className="text-2xl font-bold text-primary flex items-baseline gap-1">
                            <AnimatedCounter value={stats.xp} />
                            <span className="text-sm font-normal text-muted-foreground">XP</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-muted-foreground font-medium">Next Milestone</span>
                        <span className="text-lg font-semibold text-foreground">
                            {levelInfo.nextLevelXp || 'Max'}
                        </span>
                    </div>
                </div>

                {/* Progress Bar container */}
                <div className="relative h-4 w-full bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelInfo.progress}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                    >
                        {/* Shimmer overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    </motion.div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-2 italic">
                    Keep growing your tree by completing daily tasks!
                </p>
            </div>
        </motion.div>
    );
};

export default TreeWidget;
