"use client";

import React, { useState } from 'react';
import ResumeScreener from "@/components/career/ResumeScreener";
import AIQuestionGenerator from "@/components/career/AIInterview";
import ResumeBuilder from "@/components/career/ResumeBuilder";
import InterviewSimulator from "@/components/career/InterviewSimulator";
import SkillGapDetector from "@/components/career/SkillGapDetector";
import { CareerNavbar, Tab } from "@/components/career/CareerNavbar";

import { useSearchParams, useRouter } from 'next/navigation';

export default function CareerPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get('tab') as Tab;
    const [activeTab, setActiveTabState] = useState<Tab>(tabParam || 'screener');

    const setActiveTab = (tab: Tab) => {
        setActiveTabState(tab);
        router.push(`/dashboard/career?tab=${tab}`);
    };

    React.useEffect(() => {
        if (tabParam) {
            setActiveTabState(tabParam);
        }
    }, [tabParam]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <CareerNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-0 h-full container mx-auto fade-in">
                {activeTab === 'screener' && <ResumeScreener />}
                {activeTab === 'interview' && <InterviewSimulator />}
                {activeTab === 'builder' && <ResumeBuilder />}
                {activeTab === 'questions' && <AIQuestionGenerator />}
                {activeTab === 'skills' && <SkillGapDetector />}
            </div>
        </div>
    );
}
