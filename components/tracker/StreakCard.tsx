import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

const StreakCard = () => {
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        setUserId(localStorage.getItem('nexus_user_id'));
    }, []);

    const { stats } = useUserStats(userId);

    return (
        <div className="tracker-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem' }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--tr-danger)'
            }}>
                <Flame size={32} fill="currentColor" />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid var(--tr-danger)',
                    opacity: 0.2,
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}></div>
            </div>
            <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{stats.streak}</div>
                <div style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--tr-text-secondary)',
                    marginTop: '0.25rem'
                }}>
                    Day Streak
                </div>
            </div>
        </div>
    );
};

export default StreakCard;
