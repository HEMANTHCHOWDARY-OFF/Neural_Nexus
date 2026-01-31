"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color?: string;
}

export function QuickAction({ title, description, icon: Icon, href, color = "blue" }: QuickActionProps) {
    const colorClasses = {
        blue: "from-blue-500 to-cyan-500",
        purple: "from-purple-500 to-pink-500",
        emerald: "from-emerald-500 to-teal-500",
        amber: "from-amber-500 to-orange-500",
        indigo: "from-indigo-500 to-purple-500",
    };

    return (
        <Link href={href} className="block group">
            <div className={cn(
                "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300",
                "hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
            )}>
                {/* Gradient background on hover */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
                )} />

                <div className="relative flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-lg transition-all duration-300 bg-gradient-to-br",
                        colorClasses[color as keyof typeof colorClasses] || colorClasses.blue,
                        "group-hover:scale-110 group-hover:rotate-3"
                    )}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

interface QuickActionsProps {
    actions: QuickActionProps[];
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, index) => (
                <QuickAction key={index} {...action} />
            ))}
        </div>
    );
}
