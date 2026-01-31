"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/5 backdrop-blur-xl transition-all duration-300">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src="/nexushub-logo-v2.png"
                                alt="NexusHub Logo"
                                fill
                                sizes="40px"
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                            NexusHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Demo
                        </Link>
                        <Link href="https://github.com" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            GitHub
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                                Try Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-3 border-t border-white/10">
                        <Link href="#features" className="block px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="block px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                            Demo
                        </Link>
                        <Link href="https://github.com" target="_blank" className="block px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                            GitHub
                        </Link>
                        <Link href="/login" className="block px-4 py-2">
                            <Button variant="ghost" className="w-full">Login</Button>
                        </Link>
                        <Link href="/signup" className="block px-4 py-2">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Try Demo</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
