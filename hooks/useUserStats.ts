import { useState, useEffect, useCallback } from 'react';
import { dbService, User } from '@/lib/tracker/db';

export const useUserStats = (userId: string | null) => {
    const [stats, setStats] = useState<User>({ id: '', xp: 0, streak: 0, longest_streak: 0, level: 'Seed' });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(() => {
        if (!userId) return;
        const user = dbService.getUser(userId);
        if (user) {
            setStats(user);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchStats();

        // Listen for real-time updates from dbService
        const updateHandler = () => fetchStats();
        window.addEventListener('nexus_update', updateHandler);

        // Poll for updates (backup for cross-tab or external changes)
        const interval = setInterval(fetchStats, 2000);

        return () => {
            window.removeEventListener('nexus_update', updateHandler);
            clearInterval(interval);
        };
    }, [fetchStats]);

    return { stats, loading, refreshStats: fetchStats };
};
