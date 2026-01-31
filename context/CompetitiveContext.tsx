"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initDB, getProblemProgress, markProblemComplete as dbMarkComplete, ProblemProgress } from '@/lib/db/sqlite';
import staticProblemsData from '@/lib/cp.json'; // Direct import of the seed

interface CompetitiveStats {
    totalSolved: number;
    totalXP: number;
    solvedThisWeek: number;
    streak: number;
}

interface Problem {
    id: string; // The problem ID (e.g. "1")
    name: string;
    description: string;
    completed: boolean;
    completedDate: string | null;
    xpAwarded: number;
}

interface Notification {
    visible: boolean;
    message: string;
}

interface CompetitiveContextType {
    problems: Problem[];
    loading: boolean;
    stats: CompetitiveStats;
    markComplete: (problemId: string) => Promise<{ success: boolean; xpGained?: number; error?: any } | undefined>;
    notification: Notification;
    showToast: (message: string) => void;
    hideToast: () => void;
}

const CompetitiveContext = createContext<CompetitiveContextType | undefined>(undefined);

export const useCompetitive = () => {
    const context = useContext(CompetitiveContext);
    if (!context) {
        throw new Error('useCompetitive must be used within a CompetitiveProvider');
    }
    return context;
};

export const CompetitiveProvider = ({ children }: { children: ReactNode }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CompetitiveStats>({
        totalSolved: 0,
        totalXP: 0,
        solvedThisWeek: 0,
        streak: 0
    });

    const USER_ID = 'current_user'; // Mock User ID

    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        setLoading(true);
        try {
            await initDB();
            const progress = getProblemProgress(USER_ID);
            mergeData(progress);
        } catch (error) {
            console.error("Failed to load competitive data:", error);
        } finally {
            setLoading(false);
        }
    };

    const mergeData = (progressRecords: ProblemProgress[]) => {
        // 1. Create a map for fast lookup
        const progressMap = new Map();
        progressRecords.forEach(r => progressMap.set(r.problem_id, r));

        // 2. Merge with static seed
        const merged: Problem[] = (staticProblemsData as { cp_problems: any[] }).cp_problems.map(p => {
            const record = progressMap.get(p.id);
            return {
                ...p,
                completed: !!record,
                completedDate: record ? record.completed_date : null,
                xpAwarded: record ? record.xp_awarded : 0
            };
        });

        setProblems(merged);
        calculateStats(progressRecords);
    };

    const calculateStats = (progressRecords: ProblemProgress[]) => {
        const totalSolved = progressRecords.length;

        // XP Rule: Total XP is mostly derivative, but we stored it. 
        // Let's sum stored XP for accuracy.
        const totalXP = progressRecords.reduce((sum, r) => sum + (r.xp_awarded || 0), 0);

        // Weekly Logic
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const solvedThisWeek = progressRecords.filter(r => new Date(r.completed_date) > oneWeekAgo).length;

        // derived streak logic could go here

        setStats({
            totalSolved,
            totalXP,
            solvedThisWeek,
            streak: 0 // Placeholder
        });
    };

    const markComplete = async (problemId: string) => {
        // 1. Validations
        const problem = problems.find(p => p.id === problemId);
        if (!problem || problem.completed) return;

        // 2. XP Logic: Every 3rd problem gets +1 XP
        // We strictly follow "Every 3 completed problems".
        // Current count = stats.totalSolved. New count = stats.totalSolved + 1.
        // If (NewCount % 3 === 0) -> Award 1 XP.
        const newCount = stats.totalSolved + 1;
        const xpToAward = (newCount % 3 === 0) ? 1 : 0;

        try {
            // 3. DB Write
            const success = dbMarkComplete(USER_ID, problemId, xpToAward);

            if (success) {
                // 4. Update State Optimistically (or re-fetch)
                // We'll re-fetch just to be safe and simple, or manually update
                const progress = getProblemProgress(USER_ID);
                mergeData(progress);

                return { success: true, xpGained: xpToAward };
            }
        } catch (err) {
            console.error("Completion failed:", err);
            return { success: false, error: err };
        }
    };

    const [notification, setNotification] = useState<Notification>({ visible: false, message: '' });

    const showToast = (message: string) => {
        setNotification({ visible: true, message });
    };

    const hideToast = () => {
        setNotification(prev => ({ ...prev, visible: false }));
    };

    return (
        <CompetitiveContext.Provider value={{
            problems,
            loading,
            stats,
            markComplete,
            notification,
            showToast,
            hideToast
        }}>
            {children}
        </CompetitiveContext.Provider>
    );
};
