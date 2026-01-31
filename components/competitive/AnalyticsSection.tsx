import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useCompetitive } from '@/context/CompetitiveContext';

const AnalyticsSection = () => {
    const { stats } = useCompetitive();

    // Data for Pie Chart
    const pieData = [
        { name: 'Solved', value: stats.totalSolved },
        { name: 'Remaining', value: 50 - stats.totalSolved },
    ];
    const PIE_COLORS = ['#22C55E', '#334155'];

    // Data for Weekly Bar Chart (Mocked logic for visualization if real dates aren't fully populated)
    // In a real scenario, this comes from DB aggregation. We'll simulate a structure.
    const data = [
        { name: 'Mon', solved: 0 },
        { name: 'Tue', solved: 0 },
        { name: 'Wed', solved: 0 },
        { name: 'Thu', solved: 0 },
        { name: 'Fri', solved: 0 },
        { name: 'Sat', solved: 0 },
        { name: 'Sun', solved: stats.solvedThisWeek }, // Showing current week agg on Sunday for simplicity or mapping real days
    ];

    return (
        <div className="cp-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
            {/* Pie Chart */}
            <div className="cp-card">
                <h3 className="cp-heading" style={{ fontSize: '1.25rem' }}>Completion Rate</h3>
                <div style={{ height: 200, width: '100%', minWidth: 0, minHeight: 200, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
                                itemStyle={{ color: '#F8FAFC' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ textAlign: 'center', marginTop: '-140px' }}>
                    <div className="cp-stat-value" style={{ fontSize: '1.5rem', color: '#F8FAFC' }}>
                        {Math.round((stats.totalSolved / 50) * 100)}%
                    </div>
                    <div className="cp-text-sub">Done</div>
                </div>
                <div style={{ marginTop: '100px' }}></div>
            </div>

            {/* Weekly Activity Activity */}
            <div className="cp-card">
                <h3 className="cp-heading" style={{ fontSize: '1.25rem' }}>Weekly Activity</h3>
                <div style={{ height: 200, width: '100%', minWidth: 0, minHeight: 200, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#334155', opacity: 0.2 }}
                                contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
                            />
                            <Bar dataKey="solved" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
