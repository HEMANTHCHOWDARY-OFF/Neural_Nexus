"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-lg bg-muted/50 animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "relative w-9 h-9 rounded-lg transition-all duration-300",
                "hover:bg-accent hover:scale-105 active:scale-95",
                "flex items-center justify-center",
                "border border-border/50 hover:border-border"
            )}
            aria-label="Toggle theme"
        >
            <Sun className={cn(
                "h-[1.2rem] w-[1.2rem] transition-all duration-300",
                theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100",
                "text-amber-500"
            )} />
            <Moon className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
                theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0",
                "text-blue-500"
            )} />
        </button>
    );
}
