"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Placeholder Components (Slots)
const TreeWidgetSlot = () => (
    <div className="h-64 border border-emerald-500/30 rounded-xl flex items-center justify-center bg-emerald-500/5 backdrop-blur-sm hover:border-emerald-500/50 transition-colors cursor-pointer group relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-emerald-400 font-medium z-10">Tree Component Slot</span>
    </div>
);

const WidgetSlot = ({ title, label, color = "gray", height = "h-40" }: { title: string, label: string, color?: string, height?: string }) => (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className={`${height} border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20`}>
                <span className="text-muted-foreground">{label}</span>
            </div>
        </CardContent>
    </Card>
);

const CompetitiveSlot = () => (
    <div className="h-32 border border-yellow-500/30 rounded-xl flex items-center justify-center bg-yellow-500/5 mt-4 backdrop-blur-sm hover:bg-yellow-500/10 transition-colors">
        <span className="text-yellow-500 font-medium">Competitive Stats Slot</span>
    </div>
);

const StreakSlot = () => (
    <div className="h-24 border border-blue-500/30 rounded-xl flex items-center justify-center bg-blue-500/5 mt-4 backdrop-blur-sm">
        <span className="text-blue-400 font-medium">Streak Widget Slot</span>
    </div>
);

export default function DashboardPage() {
    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* LEFT: Main Workspace (Royal Dark) */}
            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard</h2>
                            <p className="text-muted-foreground mt-1">Overview of your progress</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WidgetSlot title="Today's Tasks" label="Tracker List Slot" />
                        <WidgetSlot title="Weekly Analytics" label="Analytics Chart Slot" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WidgetSlot title="Projects Summary" label="Projects Widget Slot" />
                        <WidgetSlot title="Career Tools" label="Resume/Jobs Slot" />
                    </div>
                </div>
            </div>

            {/* RIGHT: Focus Panel (Deep Obsidian) */}
            <div className="w-full lg:w-[400px] border-l border-white/10 bg-black/20 p-8 overflow-auto backdrop-blur-xl">
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white/90">Focus Zone</h3>

                    <div className="space-y-6">
                        <TreeWidgetSlot />
                        <StreakSlot />
                        <CompetitiveSlot />

                        <div className="p-4 border border-white/5 bg-white/5 rounded-xl mt-8">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">XP Progress</h4>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%]" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
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
