"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CheckCircle,
    Folder,
    FileText,
    Trophy,
    BarChart2,
    Settings,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tracker", href: "/dashboard/tracker", icon: CheckCircle },
    { name: "Projects", href: "/dashboard/projects", icon: Folder },
    { name: "Career", href: "/dashboard/career", icon: FileText },
    { name: "Competitive", href: "/dashboard/competitive", icon: Trophy },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <div className={cn("flex flex-col h-full border-r bg-card text-card-foreground", className)}>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/nexushub-logo-v2.png"
                            alt="NexusHub Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold">NexusHub</span>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "bg-secondary"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
