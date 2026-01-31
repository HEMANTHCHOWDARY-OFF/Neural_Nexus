"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Placeholder Components (Slots)
const TreeWidgetSlot = () => (
    <div className="h-64 border-2 border-dashed border-emerald-500/20 rounded-lg flex items-center justify-center bg-emerald-500/5">
        <span className="text-emerald-500 font-medium">Tree Component Slot</span>
    </div>
);

const TrackerSlot = () => (
    <Card>
        <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">Tracker List Slot</span>
            </div>
        </CardContent>
    </Card>
);

const ProjectsSlot = () => (
    <Card>
        <CardHeader>
            <CardTitle>Projects Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">Projects Widget Slot</span>
            </div>
        </CardContent>
    </Card>
);

const AnalyticsSlot = () => (
    <Card>
        <CardHeader>
            <CardTitle>Weekly Analytics</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">Analytics Chart Slot</span>
            </div>
        </CardContent>
    </Card>
);

const CareerSlot = () => (
    <Card>
        <CardHeader>
            <CardTitle>Career Tools</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400">Resume/Jobs Slot</span>
            </div>
        </CardContent>
    </Card>
);

const CompetitiveSlot = () => (
    <div className="h-32 border-2 border-dashed border-yellow-500/20 rounded-lg flex items-center justify-center bg-yellow-500/5 mt-4">
        <span className="text-yellow-500 font-medium">Competitive Stats Slot</span>
    </div>
);

const StreakSlot = () => (
    <div className="h-24 border-2 border-dashed border-blue-500/20 rounded-lg flex items-center justify-center bg-blue-500/5 mt-4">
        <span className="text-blue-500 font-medium">Streak Widget Slot</span>
    </div>
);

export default function DashboardPage() {
    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* LEFT: Light Theme - Main Workspace */}
            <div className="flex-1 p-8 bg-slate-50 overflow-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
                        <p className="text-slate-500">Overview of your progress</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TrackerSlot />
                        <AnalyticsSlot />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProjectsSlot />
                        <CareerSlot />
                    </div>
                </div>
            </div>

            {/* RIGHT: Dark Theme - Focus Panel */}
            <div className="w-full lg:w-[400px] bg-slate-900 text-slate-100 p-8 overflow-auto border-l border-slate-800">
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-slate-200">Focus Zone</h3>

                    <div className="space-y-6">
                        <TreeWidgetSlot />
                        <StreakSlot />
                        <CompetitiveSlot />

                        <div className="p-4 bg-slate-800 rounded-lg mt-8">
                            <h4 className="text-sm font-medium text-slate-400 mb-2">XP Progress</h4>
                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[65%]" />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Level 5</span>
                                <span>1250 / 2000 XP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
