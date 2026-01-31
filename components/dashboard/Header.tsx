"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-background/30 backdrop-blur-md sticky top-0 z-20">
            <div>
                <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Welcome back, {user?.displayName || "User"}</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Avatar>
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback>{user?.displayName?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
