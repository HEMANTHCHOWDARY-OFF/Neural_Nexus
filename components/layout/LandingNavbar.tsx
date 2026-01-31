"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function LandingNavbar() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/nexushub-logo-v2.png"
                            alt="NexusHub Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        NexusHub
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        How it Works
                    </Link>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                        ) : user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                                <Button onClick={handleLogout} variant="outline">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4">
                    <Link href="#features" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                        How it Works
                    </Link>
                    <div className="flex flex-col gap-2 pt-4 border-t">
                        {loading ? (
                            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                        ) : user ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full" variant="ghost">Dashboard</Button>
                                </Link>
                                <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" className="w-full">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full" variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
