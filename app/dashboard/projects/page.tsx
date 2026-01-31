"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Code, Users, Calendar, ArrowRight, Layers, CheckSquare } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

interface Project {
    id: string;
    title: string;
    description: string;
    owner_id: string;
    tech_stack: string;
    created_at: number;
    members_count: number;
}

// Demo data to display when no projects exist
const DEMO_PROJECTS: Project[] = [
    {
        id: "demo-resume-screener",
        title: "AI Resume Screener",
        description: "Automated candidate screening tool using OpenAI GPT-4 for parsing and analysis. Features real-time scoring and PDF extraction.",
        owner_id: "demo",
        tech_stack: "React, Python, OpenAI",
        created_at: Date.now(),
        members_count: 4,
    },
    {
        id: "demo-crypto-bot",
        title: "Crypto Trading Bot",
        description: "High-frequency trading bot with real-time analytics, portfolio management, and WebSocket integration for live market data.",
        owner_id: "demo",
        tech_stack: "Node.js, WebSocket, Docker",
        created_at: Date.now() - 86400000 * 2,
        members_count: 6,
    }
];

export default function ProjectsPage() {
    const { user } = useAuth();
    // OPTIMISTIC UI: Start with DEMO_PROJECTS immediately so there is 0 wait time.
    // Real data will overwrite this if it exists.
    const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
    const [loading, setLoading] = useState(false); // No blocking load
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            // Fetch in background
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setProjects(data); // Only replace if we have real projects
                }
                // If data is empty, we keep DEMO_PROJECTS (default)
            }
        } catch (error) {
            console.error("Error loading projects:", error);
            // On error, we keep DEMO_PROJECTS
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!user) return;

        const title = prompt("Enter project name:");
        if (!title) return;

        const description = prompt("Enter project description (optional):");

        setCreating(true);
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: description || "",
                    owner_id: user.uid,
                    tech_stack: "JavaScript, React, Node.js",
                }),
            });

            if (res.ok) {
                loadProjects();
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-muted-foreground">Loading projects...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Projects
                    </h1>
                    <p className="text-muted-foreground text-lg mt-2">
                        Collaborative coding workspace with real-time editing
                    </p>
                </div>
                <Button onClick={handleCreateProject} disabled={creating} size="lg" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-5 h-5 mr-2" />
                    {creating ? "Creating..." : "New Project"}
                </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => {
                    // Add mock task counts for visualization if not present
                    const tasksCount = (project as any).tasks_count || (index === 0 ? 12 : index === 1 ? 8 : 3);

                    return (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block h-full">
                            <Card className="group relative h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary group-hover:from-primary group-hover:to-purple-600 group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-md">
                                            <Code className="w-6 h-6" />
                                        </div>
                                        {/* Tech Stack Badge */}
                                        <div className="px-2.5 py-1 rounded-full bg-secondary/50 border border-secondary text-xs font-medium text-muted-foreground">
                                            {project.tech_stack.split(',')[0]}
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                        {project.description || "No description"}
                                    </p>

                                    <div className="space-y-4">
                                        {/* Stats Row */}
                                        <div className="flex items-center justify-between text-sm">
                                            {/* Mock Avatar Pile */}
                                            <div className="flex items-center -space-x-2">
                                                {[...Array(Math.min(project.members_count, 4))].map((_, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[10px] text-white font-bold">
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                ))}
                                                {project.members_count > 4 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                        +{project.members_count - 4}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-muted-foreground">
                                                <div className="flex items-center gap-1.5" title="Tasks">
                                                    <CheckSquare className="w-4 h-4" />
                                                    <span className="font-medium">{tasksCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5" title="Created">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:translate-y-[-2px]">
                                            Open Code Room
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}

                {/* Create New Card (always visible at end if lots of projects, or embedded if we want) - kept simple in header for now */}
            </div>
        </div>
    );
}
