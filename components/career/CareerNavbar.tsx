"use client";

import { cn } from "@/lib/utils";
import { PenTool, FileText, MessageSquare, HelpCircle, Target } from "lucide-react";

export type Tab = 'screener' | 'interview' | 'builder' | 'questions' | 'skills';

type CareerNavbarProps = {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
};

export function CareerNavbar({ activeTab, setActiveTab }: CareerNavbarProps) {
    const navItems = [
        { name: 'Resume Builder', icon: PenTool, id: 'builder', action: () => setActiveTab('builder') },
        { name: 'Resume Screener', icon: FileText, id: 'screener', action: () => setActiveTab('screener') },
        { name: 'AI Interview', icon: MessageSquare, id: 'interview', action: () => setActiveTab('interview') },
        { name: 'Generate Questions', icon: HelpCircle, id: 'questions', action: () => setActiveTab('questions') },
        { name: 'Skill Gap', icon: Target, id: 'skills', action: () => setActiveTab('skills') },
    ];

    return (
        <div className="w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm mb-6 rounded-xl overflow-hidden mt-0">
            <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={item.action}
                        className={cn(
                            "flex-1 min-w-[150px] py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                            // @ts-ignore
                            activeTab === item.id
                                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                                : "border-transparent text-gray-500 dark:text-gray-400"
                        )}
                    >
                        <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-blue-500" : "text-gray-400")} />
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
