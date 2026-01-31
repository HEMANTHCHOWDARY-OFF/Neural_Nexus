import React from 'react';
import { useCompetitive } from '@/context/CompetitiveContext';
import { Trophy, Zap, TrendingUp, Target } from 'lucide-react';

export const CompetitiveSummaryCard = () => {
    const { stats } = useCompetitive();
    const progress = (stats.totalSolved / 50) * 100;

    return (
        <div className="cp-card relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Trophy className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h3 className="font-semibold text-foreground">Progress</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">Goal: 50</span>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                    {/* Solved Count */}
                    <div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                {stats.totalSolved}
                            </span>
                            <span className="text-2xl text-muted-foreground">/ 50</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% Complete</p>
                    </div>

                    {/* XP Display */}
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-muted-foreground">Total XP</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-500">
                                {stats.totalXP}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ConsistencyCard = () => {
    const { stats } = useCompetitive();

    const getMotivation = (solvedWeekly: number) => {
        if (solvedWeekly === 0) return { text: "Start your streak today!", icon: Target, color: "text-blue-500" };
        if (solvedWeekly < 3) return { text: "Great momentum!", icon: TrendingUp, color: "text-green-500" };
        return { text: "Unstoppable! 🔥", icon: Zap, color: "text-orange-500" };
    };

    const motivation = getMotivation(stats.solvedThisWeek);
    const MotivationIcon = motivation.icon;

    return (
        <div className="cp-card relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/10">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">This Week</h3>
                </div>

                {/* Weekly Count */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-green-500">
                            {stats.solvedThisWeek}
                        </span>
                        <span className="text-lg text-muted-foreground">solved</span>
                    </div>
                </div>

                {/* Motivation Message */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2">
                        <MotivationIcon className={`w-4 h-4 ${motivation.color}`} />
                        <p className="text-sm font-medium text-foreground">
                            {motivation.text}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
