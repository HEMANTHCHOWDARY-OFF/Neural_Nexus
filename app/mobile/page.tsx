"use client";

import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Apple, Share, PlusSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MobilePage() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <LandingNavbar />

            <section className="pt-32 pb-20 container px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            <span className="text-white">NexusHub on</span>{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Mobile
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                            Take your career growth anywhere. Install NexusHub as an app today or join the waitlist for our native iOS and Android apps.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {/* Option 1: PWA */}
                        <motion.div
                            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                                <Smartphone className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Install Web App</h3>
                            <p className="text-gray-400 mb-6">
                                Get the full experience instantly without visiting the app store. Works on iOS and Android.
                            </p>

                            {deferredPrompt && (
                                <Button
                                    onClick={handleInstallClick}
                                    className="w-full mb-6 bg-blue-600 hover:bg-blue-500"
                                >
                                    <Download className="mr-2 h-4 w-4" /> Install Now
                                </Button>
                            )}

                            <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                                <p className="text-sm font-semibold text-gray-300">How to install manually:</p>
                                <div className="flex items-start gap-3 text-sm text-gray-400">
                                    <span className="font-bold text-white">iOS:</span>
                                    <span>Tap <Share className="inline w-4 h-4" /> Share, then "Add to Home Screen" <PlusSquare className="inline w-4 h-4" /></span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-400">
                                    <span className="font-bold text-white">Android:</span>
                                    <span>Tap menu (⋮), then "Install App" or "Add to Home Screen"</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Option 2: Native Waitlist */}
                        <motion.div
                            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                                <Apple className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Native App Waitlist</h3>
                            <p className="text-gray-400 mb-6">
                                We're building dedicated apps for the App Store and Play Store with offline mode and push notifications.
                            </p>

                            <form onSubmit={(e) => { e.preventDefault(); alert("Added to waitlist!"); }} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                                    Notify Me
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
