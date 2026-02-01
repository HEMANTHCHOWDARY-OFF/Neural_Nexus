"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import TreeWidget from "@/components/tracker/TreeWidget";
import { CheckCircle, Briefcase, Trophy, Target, TrendingUp, Zap, Calendar, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useUserStats } from "@/hooks/useUserStats";
import { dbService } from "@/lib/tracker/db";

// Helper component for Today's Progress
function TodaysProgress() {
    return (
        <Card className="h-full border-border/50 bg-gradient-to-br from-card to-secondary/10">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                    Today's Focus
                    <span className="text-xs font-normal px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                        On Track
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Goals</span>
                        <span className="font-bold">85%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">You're crushing it! Just 1 more task to hit your daily target.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" /> Streak
                        </div>
                        <div className="text-xl font-bold">12 Days</div>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-purple-500" /> XP Earned
                        </div>
                        <div className="text-xl font-bold">+450</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [completedTasksCount, setCompletedTasksCount] = useState(0);

    useEffect(() => {
        // Hydration fix: accessing localStorage only on client mount
        const storedUserId = localStorage.getItem('nexus_user_id');
        setUserId(storedUserId);

        if (storedUserId) {
            // Load task counts
            const tasks = dbService.getTasks(storedUserId);
            const completed = tasks.filter(t => t.completed).length;
            setCompletedTasksCount(completed);
        }
    }, []);

    const { stats } = useUserStats(userId);

    const quickActions = [
        {
            title: "Habit Tracker",
            description: "Build habits, grow your tree",
            icon: CheckCircle,
            href: "/dashboard/tracker",
            color: "emerald" as const,
        },
        {
            title: "Career AI",
            description: "Resume & Interview prep",
            icon: Briefcase,
            href: "/dashboard/career",
            color: "indigo" as const,
        },
        {
            title: "Competitive",
            description: "Track coding progress",
            icon: Trophy,
            href: "/dashboard/competitive",
            color: "amber" as const,
        },
        {
            title: "Analytics",
            description: "View your insights",
            icon: TrendingUp,
            href: "/dashboard/analytics",
            color: "blue" as const,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        You're growing fast! Check out your updated tree.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-full border shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Hero Section: Tree + Today's Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-3xl blur-xl transition-opacity opacity-50 group-hover:opacity-100" />
                    <div className="relative h-full bg-card/50 backdrop-blur-sm border border-green-500/20 rounded-3xl overflow-hidden hover:border-green-500/40 transition-colors shadow-lg">
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/80 backdrop-blur rounded-full text-xs font-medium text-green-600 border border-green-200">
                            Your Growth
                        </div>
                        <TreeWidget />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <TodaysProgress />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Current Streak"
                    value={`${stats.streak} days`}
                    icon={Zap}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatsCard
                    title="Tasks Completed"
                    value={completedTasksCount.toString()}
                    icon={CheckCircle}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatsCard
                    title="Active Projects"
                    value="3"
                    icon={Target}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatsCard
                    title="Total XP"
                    value={stats.xp.toLocaleString()}
                    icon={Trophy}
                    trend={{ value: 0, isPositive: true }}
                />
            </div>

            {/* Content Grid: Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Quick Actions</h2>
                    </div>
                    <QuickActions actions={quickActions} />
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {[
                            { action: "Completed daily coding challenge", time: "2 hours ago", color: "emerald", xp: "+50 XP" },
                            { action: "Updated resume with new skills", time: "5 hours ago", color: "blue", xp: "+20 XP" },
                            { action: "Practiced mock interview", time: "1 day ago", color: "purple", xp: "+100 XP" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="relative mt-1">
                                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500 group-hover:scale-125 transition-transform`} />
                                    <div className={`absolute top-3 left-1.5 w-0.5 h-full bg-${item.color}-500/20 -z-10`} />
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium group-hover:text-primary transition-colors cursor-pointer">
                                            {item.action}
                                        </p>
                                        <span className="text-xs font-bold text-green-500/80 bg-green-500/10 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                            {item.xp}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
