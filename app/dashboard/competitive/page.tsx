"use client";

import React from 'react';
import { CompetitiveProvider } from '@/context/CompetitiveContext';
import ProblemList from '@/components/competitive/ProblemList';
import AnalyticsSection from '@/components/competitive/AnalyticsSection';
import { CompetitiveSummaryCard, ConsistencyCard } from '@/components/competitive/DashboardWidgets';
import '@/app/competitive.css';

const DashboardContent = () => {
    return (
        <div className="cp-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="cp-heading" style={{ fontSize: '2rem' }}>Competitive Dashboard</h1>
                <p className="cp-text-sub">Track your progress and master algorithms.</p>
            </header>

            <div className="cp-grid">
                {/* Main Content Area */}
                <div>
                    {/* Summary Widgets Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <CompetitiveSummaryCard />
                        <ConsistencyCard />
                    </div>

                    {/* Problem List */}
                    <ProblemList />
                </div>

                {/* Sidebar / Analytics Area */}
                <div>
                    <AnalyticsSection />
                </div>
            </div>
        </div>
    );
};

export default function CompetitivePage() {
    return (
        <CompetitiveProvider>
            <DashboardContent />
        </CompetitiveProvider>
    );
}
