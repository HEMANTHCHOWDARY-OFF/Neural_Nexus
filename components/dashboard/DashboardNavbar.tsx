"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CheckCircle,
    Folder,
    Briefcase,
    Trophy,
    BarChart2,
    LogOut,
    Menu,
    X,
    ChevronDown,
    PenTool,
    FileText,
    MessageSquare,
    HelpCircle,
    Video,
    User
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Tracker", href: "/dashboard/tracker", icon: CheckCircle },
        { name: "Projects", href: "/dashboard/projects", icon: Folder },
        { name: "Interview", href: "/dashboard/interview-prep", icon: Video },
        {
            name: "Career",
            href: "/dashboard/career",
            icon: Briefcase,
            subItems: [
                { name: 'Resume Builder', href: '/dashboard/career?tab=builder', icon: PenTool },
                { name: 'Resume Screener', href: '/dashboard/career?tab=screener', icon: FileText },
                { name: 'AI Interview', href: '/dashboard/career?tab=interview', icon: MessageSquare },
                { name: 'Generate Questions', href: '/dashboard/career?tab=questions', icon: HelpCircle },
            ]
        },
        { name: "Competitive", href: "/dashboard/competitive", icon: Trophy },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/nexushub-logo-v2.png"
                                alt="NexusHub Logo"
                                fill
                                sizes="32px"
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 hidden md:block">
                            NexusHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-center flex-1 px-8 gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            if (item.subItems) {
                                return (
                                    <DropdownMenu key={item.name}>
                                        <DropdownMenuTrigger className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 outline-none",
                                            isActive
                                                ? "bg-primary/20 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}>
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                            <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
                                            {item.subItems.map(subItem => (
                                                <DropdownMenuItem key={subItem.name} asChild>
                                                    <Link
                                                        href={subItem.href}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
                                                    >
                                                        <subItem.icon className="w-4 h-4 mr-2 text-blue-400" />
                                                        {subItem.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                        isActive
                                            ? "bg-primary/20 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side: User Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Notification Bell (New Feature) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-accent transition-colors outline-none">
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-card" />
                                <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-20" />
                                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 border-border bg-popover/95 backdrop-blur-xl">
                                <div className="p-3 border-b border-border flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Help Requests</h4>
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">1 New</span>
                                </div>
                                <div className="p-2 space-y-2">
                                    <div className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                                                H
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">Hemanth needs help</p>
                                                <p className="text-xs text-muted-foreground">"Stuck on DP Graph problem logic"</p>
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-xs bg-green-600 hover:bg-green-700 w-full"
                                                        onClick={() => {
                                                            import('react-hot-toast').then(({ toast }) => {
                                                                toast.success("Joined Hemanth's workspace!", { icon: '🚀' });
                                                            });
                                                        }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-7 text-xs w-full">Decline</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 border-t border-border bg-muted/20 text-center">
                                    <p className="text-[10px] text-muted-foreground">Nearby Developers: 12 Online</p>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ThemeToggle />
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors bg-clip-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="text-left hidden xl:block">
                                    <p className="text-xs font-medium">{user?.displayName || 'User'}</p>
                                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-1">
                                        <Link
                                            href="/dashboard/profile"
                                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border space-y-1 bg-card">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <div key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block w-full text-left px-4 py-3 text-sm font-medium",
                                            isActive
                                                ? "bg-primary/10 text-primary border-l-4 border-primary"
                                                : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-4 border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </div>
                                    </Link>
                                    {/* Sub Items for Mobile */}
                                    {item.subItems && (
                                        <div className="pl-12 pr-4 space-y-1 mt-1 mb-2">
                                            {item.subItems.map(subItem => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <subItem.icon className="w-4 h-4" />
                                                        {subItem.name}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="pt-4 mt-4 border-t border-border px-4">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary p-3 rounded-lg hover:bg-primary/20 transition-colors mb-2"
                            >
                                <User className="w-5 h-5" /> Profile
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-500 p-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
