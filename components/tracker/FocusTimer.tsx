import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, Coffee } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { dbService } from '@/lib/tracker/db';

const FocusTimer = () => {
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        setUserId(localStorage.getItem('nexus_user_id'));
    }, []);

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus'); // focus | break

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer Finished
            setIsActive(false);
            handleComplete();
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        if (!userId) return;

        if (mode === 'focus') {
            toast.success("Focus Session Complete! +50 XP");
            const user = dbService.getUser(userId);
            dbService.updateUser(userId, { xp: user.xp + 50 });
            setMode('break');
            setTimeLeft(5 * 60);
        } else {
            toast("Break over! Ready to focus?", { icon: '☕' });
            setMode('focus');
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((mode === 'focus' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60) * 100;

    return (
        <div className="tracker-card flex-col" style={{ alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Progress Ring Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                backgroundColor: mode === 'focus' ? 'var(--tr-accent)' : 'var(--tr-text-secondary)',
                width: `${progress}%`,
                transition: 'width 1s linear'
            }} />

            <div style={{
                backgroundColor: mode === 'focus' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: mode === 'focus' ? 'var(--tr-accent)' : 'var(--tr-text-secondary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {mode === 'focus' ? '🔥 Focus Mode' : '☕ Break Time'}
            </div>

            <div style={{ fontSize: '4rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-2px' }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                    onClick={toggleTimer}
                    className="tracker-btn"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
                <button
                    onClick={resetTimer}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '1px solid var(--tr-border)',
                        backgroundColor: 'var(--tr-bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--tr-text-secondary)'
                    }}
                    className="hover:bg-gray-100 transition-colors"
                >
                    <RotateCw size={24} />
                </button>
            </div>
        </div>
    );
};

export default FocusTimer;
