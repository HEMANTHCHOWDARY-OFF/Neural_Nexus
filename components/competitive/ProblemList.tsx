import React, { useState } from 'react';
import ProblemItem from './ProblemItem';
import ProblemModal from './ProblemModal';
import { useCompetitive } from '@/context/CompetitiveContext';
import { Filter, Code2 } from 'lucide-react';
import Toast from './Toast';

const ProblemList = () => {
    const { problems, markComplete, loading, showToast, notification, hideToast } = useCompetitive();
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'
    const [selectedProblem, setSelectedProblem] = useState<any>(null);

    if (loading) return <div className="cp-text-sub">Loading problems...</div>;

    const filteredProblems = problems.filter(p => {
        if (filter === 'completed') return p.completed;
        if (filter === 'incomplete') return !p.completed;
        return true;
    });

    const handleToggle = async (id: string) => {
        const result = await markComplete(id);
        if (result?.success && result.xpGained && result.xpGained > 0) {
            showToast(`🎉 Problem Solved! You Gained +${result.xpGained} XP!`);
        } else if (result?.success) {
            // showToast("Problem Solved!");
        }
    };

    return (
        <div className="cp-card">
            <ProblemModal
                problem={selectedProblem}
                onClose={() => setSelectedProblem(null)}
            />

            {/* Re-using the ported Toast logic via context */}
            <Toast
                message={notification.message}
                visible={notification.visible}
                onClose={hideToast}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Problems</h2>
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="all">All Problems</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>
            </div>

            <div className="cp-problem-list">
                {filteredProblems.map(p => (
                    <ProblemItem
                        key={p.id}
                        problem={p}
                        onToggle={handleToggle}
                        onSelect={() => setSelectedProblem(p)}
                    />
                ))}
                {filteredProblems.length === 0 && (
                    <div className="cp-text-sub" style={{ textAlign: 'center', padding: '2rem' }}>
                        No problems found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemList;
