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

        // Poll for updates (simple way to keep it reactive since we aren't using a real-time valid store subscription)
        // 2 second interval is fast enough for UI without killing performance
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    return { stats, loading, refreshStats: fetchStats };
};
