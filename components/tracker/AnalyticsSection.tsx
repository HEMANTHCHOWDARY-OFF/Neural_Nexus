import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/tracker/db';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsSection = () => {
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        setUserId(localStorage.getItem('nexus_user_id'));
    }, []);

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        const fetchLogs = () => {
            const logs = dbService.getRecentLogs(userId);
            const formatted = logs.map(l => ({
                date: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
                score: l.mood === '🔥 Productive' ? 100 : (l.mood === '🙂 Happy' ? 80 : 50)
            }));
            setData(formatted);
        };

        fetchLogs();

        const updateHandler = () => fetchLogs();
        window.addEventListener('nexus_update', updateHandler);

        return () => window.removeEventListener('nexus_update', updateHandler);
    }, [userId]);

    return (
        <div className="tracker-card flex-col">
            <div className="flex-between">
                <h2>Productivity Trend</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--tr-text-secondary)' }}>Last 7 Days</div>
            </div>

            <div style={{ height: '200px', width: '100%', marginTop: '1rem', minHeight: '200px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" stroke="var(--tr-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="var(--tr-accent)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--tr-accent)', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsSection;
