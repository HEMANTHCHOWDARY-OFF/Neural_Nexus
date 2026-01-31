"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex h-screen overflow-hidden bg-background flex-col">
                {/* Top Navigation Bar */}
                <DashboardNavbar />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20 p-6">
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
