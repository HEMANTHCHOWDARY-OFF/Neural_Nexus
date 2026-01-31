"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Target,
    Code,
    Trophy,
    Calendar,
    BarChart3,
    PieChart,
    LineChart
} from "lucide-react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AnalyticsData {
    totalProjects: number;
    totalFiles: number;
    totalWhiteboards: number;
    recentActivity: number;
    projectsThisWeek: number;
    filesThisWeek: number;
    weeklyGrowth: number;
}

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalProjects: 0,
        totalFiles: 0,
        totalWhiteboards: 0,
        recentActivity: 0,
        projectsThisWeek: 0,
        filesThisWeek: 0,
        weeklyGrowth: 0
    });

    useEffect(() => {
        if (user) {
            loadAnalytics();
        }
    }, [user]);

    const loadAnalytics = async () => {
        if (!user) return;

        try {
            // Get total projects
            const projectsQuery = query(
                collection(db, "projects"),
                where("owner_id", "==", user.uid)
            );
            const projectsSnap = await getDocs(projectsQuery);
            const totalProjects = projectsSnap.size;

            // Get total files
            const filesQuery = query(collection(db, "project_files"));
            const filesSnap = await getDocs(filesQuery);
            let totalFiles = 0;
            filesSnap.forEach(doc => {
                const data = doc.data();
                if (projectsSnap.docs.some(p => p.id === data.project_id)) {
                    totalFiles++;
                }
            });

            // Get whiteboards
            const whiteboardsQuery = query(collection(db, "project_whiteboard"));
            const whiteboardsSnap = await getDocs(whiteboardsQuery);
            let totalWhiteboards = 0;
            whiteboardsSnap.forEach(doc => {
                const data = doc.data();
                if (projectsSnap.docs.some(p => p.id === data.project_id)) {
                    totalWhiteboards++;
                }
            });

            // Calculate weekly stats
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            let projectsThisWeek = 0;
            projectsSnap.forEach(doc => {
                const data = doc.data();
                if (data.created_at && data.created_at.toDate() > weekAgo) {
                    projectsThisWeek++;
                }
            });

            const weeklyGrowth = totalProjects > 0
                ? Math.round((projectsThisWeek / totalProjects) * 100)
                : 0;

            setAnalytics({
                totalProjects,
                totalFiles,
                totalWhiteboards,
                recentActivity: projectsThisWeek + totalFiles,
                projectsThisWeek,
                filesThisWeek: totalFiles,
                weeklyGrowth
            });
        } catch (error: any) {
            console.error("Error loading analytics:", error);
            // Set default analytics on error to prevent UI issues
            setAnalytics({
                totalProjects: 0,
                totalFiles: 0,
                totalWhiteboards: 0,
                recentActivity: 0,
                projectsThisWeek: 0,
                filesThisWeek: 0,
                weeklyGrowth: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: "Total Projects",
            value: analytics.totalProjects,
            icon: Code,
            trend: analytics.projectsThisWeek > 0 ? "up" : "neutral",
            trendValue: `+${analytics.projectsThisWeek} this week`,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Code Files",
            value: analytics.totalFiles,
            icon: Activity,
            trend: "up",
            trendValue: `${analytics.totalFiles} total`,
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Whiteboards",
            value: analytics.totalWhiteboards,
            icon: PieChart,
            trend: analytics.totalWhiteboards > 0 ? "up" : "neutral",
            trendValue: `${analytics.totalWhiteboards} active`,
            color: "from-orange-500 to-red-500"
        },
        {
            title: "Weekly Growth",
            value: `${analytics.weeklyGrowth}%`,
            icon: TrendingUp,
            trend: analytics.weeklyGrowth > 0 ? "up" : "neutral",
            trendValue: "Project creation rate",
            color: "from-green-500 to-emerald-500"
        }
    ];

    const activityData = [
        { day: "Mon", projects: 2, files: 5 },
        { day: "Tue", projects: 1, files: 8 },
        { day: "Wed", projects: 3, files: 12 },
        { day: "Thu", projects: 2, files: 6 },
        { day: "Fri", projects: 4, files: 15 },
        { day: "Sat", projects: 1, files: 3 },
        { day: "Sun", projects: 2, files: 7 }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Analytics
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                    Track your productivity and project insights
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs">
                                        {stat.trend === "up" ? (
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <Activity className="w-3 h-3 text-muted-foreground" />
                                        )}
                                        <span className={stat.trend === "up" ? "text-green-500" : "text-muted-foreground"}>
                                            {stat.trendValue}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Activity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Weekly Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activityData.map((day, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium w-12">{day.day}</span>
                                    <div className="flex-1 mx-4">
                                        <div className="flex gap-1">
                                            {/* Projects bar */}
                                            <div
                                                className="h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded transition-all duration-300 hover:opacity-80"
                                                style={{ width: `${(day.projects / 5) * 100}%` }}
                                            />
                                            {/* Files bar */}
                                            <div
                                                className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded transition-all duration-300 hover:opacity-80"
                                                style={{ width: `${(day.files / 15) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>{day.projects} projects</span>
                                        <span>{day.files} files</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-cyan-500" />
                            <span className="text-xs text-muted-foreground">Projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
                            <span className="text-xs text-muted-foreground">Files</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Project Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Active Projects</span>
                                    <span className="font-bold">{analytics.totalProjects}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>With Whiteboards</span>
                                    <span className="font-bold">{analytics.totalWhiteboards}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                        style={{ width: `${analytics.totalProjects > 0 ? (analytics.totalWhiteboards / analytics.totalProjects) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Total Files</span>
                                    <span className="font-bold">{analytics.totalFiles}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        style={{ width: "85%" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold">First Project</p>
                                    <p className="text-xs text-muted-foreground">Created your first project</p>
                                </div>
                            </div>
                            {analytics.totalProjects >= 5 && (
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Code className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Project Master</p>
                                        <p className="text-xs text-muted-foreground">Created 5+ projects</p>
                                    </div>
                                </div>
                            )}
                            {analytics.totalFiles >= 10 && (
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Code Warrior</p>
                                        <p className="text-xs text-muted-foreground">Created 10+ files</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
