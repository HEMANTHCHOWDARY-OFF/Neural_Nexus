"use client";

import React, { useEffect, useState } from 'react';
import TreeWidget from '@/components/tracker/TreeWidget';
import StreakCard from '@/components/tracker/StreakCard';
import TaskList from '@/components/tracker/TaskList';
import DailyLogForm from '@/components/tracker/DailyLogForm';
import AnalyticsSection from '@/components/tracker/AnalyticsSection';
import FocusTimer from '@/components/tracker/FocusTimer';
import { Toaster } from 'react-hot-toast';
import '@/app/tracker.css';

export default function TrackerPage() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Generate or retrieve a persistent User ID for this browser
        let storedId = localStorage.getItem('nexus_user_id');
        if (!storedId) {
            storedId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('nexus_user_id', storedId);
        }
        setUserId(storedId);
    }, []);

    if (!userId) {
        return <div className="p-8 text-center text-gray-500">Loading Tracker...</div>;
    }

    return (
        <div className="tracker-container p-6 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Habit Tracker</h1>
                <p className="text-gray-500">Stay consistent and watch your tree grow.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Action Loop) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <TreeWidget />
                        </div>
                        <div>
                            <StreakCard />
                        </div>
                    </div>

                    {/* Middle Section */}
                    <TaskList userId={userId} />

                    {/* Bottom Section */}
                    <DailyLogForm userId={userId} />
                </div>

                {/* Right Column (Analytics - Side) */}
                <div className="flex flex-col gap-6">
                    <FocusTimer />
                    <AnalyticsSection />
                </div>
            </div>

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'var(--tr-bg-secondary)',
                        color: 'var(--tr-text-primary)',
                        border: '1px solid var(--tr-border)',
                    },
                }}
            />
        </div>
    );
}
