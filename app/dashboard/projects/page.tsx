"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Code, Users, Calendar, ArrowRight, Layers, CheckSquare } from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, writeBatch, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Project {
    id: string;
    title: string;
    description: string;
    owner_id: string;
    tech_stack: string;
    created_at: any; // Firestore Timestamp or number
    members_count: number;
}

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        tech_stack: "JavaScript, React, Node.js" // Default
    });

    useEffect(() => {
        // Real-time listener
        const q = query(collection(db, "projects")); // We can add orderBy created_at provided index exists, else client sort

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];

            // Client-side sort to avoid index requirements for now
            projectList.sort((a, b) => {
                const timeA = a.created_at?.toMillis ? a.created_at.toMillis() : (a.created_at || 0);
                const timeB = b.created_at?.toMillis ? b.created_at.toMillis() : (b.created_at || 0);
                return timeB - timeA;
            });

            setProjects(projectList);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to projects:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newProject.title.trim()) return;

        setIsCreating(true);
        try {
            const batch = writeBatch(db);

            // Generate IDs
            const projectRef = doc(collection(db, "projects"));
            const projectId = projectRef.id;

            // 1. Create Project Map
            batch.set(projectRef, {
                id: projectId,
                title: newProject.title,
                description: newProject.description,
                owner_id: user.uid,
                tech_stack: newProject.tech_stack,
                created_at: Timestamp.now(),
                updated_at: Timestamp.now(),
                members_count: 1
            });

            // 2. Add Owner as Member
            const memberRef = doc(collection(db, "project_members"));
            batch.set(memberRef, {
                project_id: projectId,
                user_id: user.uid,
                role: "owner",
                joined_at: Timestamp.now()
            });

            // 3. Create Default File
            const fileId = `${projectId}__index.js`;
            const fileRef = doc(db, "project_files", fileId);
            batch.set(fileRef, {
                project_id: projectId,
                filename: "index.js",
                filepath: "/index.js",
                language: "javascript",
                content: '// Welcome to your new project!\nconsole.log("Hello, World!");',
                updated_at: Timestamp.now(),
                updated_by: user.uid
            });

            // Commit all changes
            await batch.commit();

            toast.success("Project created successfully!");
            setIsCreateOpen(false);
            setNewProject({ title: "", description: "", tech_stack: "JavaScript, React, Node.js" });
        } catch (error: any) {
            console.error("Error creating project:", error);
            toast.error(error.message || "Failed to create project");
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-muted-foreground">Syncing projects...</div>
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

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Plus className="w-5 h-5 mr-2" />
                            New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] border-white/10 bg-zinc-950/95 backdrop-blur-xl text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Create Project</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Start a new collaborative coding environment.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateProject} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-zinc-200">
                                    Project Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. AI Resume Screener"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 text-white placeholder:text-zinc-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tech_stack" className="text-sm font-medium text-zinc-200">Tech Stack</Label>
                                <Input
                                    id="tech_stack"
                                    placeholder="e.g. React, Python, OpenAI"
                                    value={newProject.tech_stack}
                                    onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 text-white placeholder:text-zinc-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-zinc-200">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your project..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="resize-none bg-white/5 border-white/10 focus:border-indigo-500/50 text-white placeholder:text-zinc-500 min-h-[100px]"
                                    rows={4}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all">
                                    {isCreating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Project
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border rounded-3xl border-dashed border-white/10 bg-white/5">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Create your first project to start coding with your team.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateOpen(true)}
                            className="border-white/20 hover:bg-white/5"
                        >
                            Create Project
                        </Button>
                    </div>
                ) : (
                    projects.map((project, index) => {
                        // Mock task count if not present
                        const tasksCount = (project as any).tasks_count || 0;
                        const membersCount = project.members_count || 1;

                        return (
                            <Link key={project.id} href={`/dashboard/projects/${project.id}/intro`} className="block h-full">
                                <Card className="group relative h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm flex flex-col">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <CardHeader className="pb-2 relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                                                <Code className="w-6 h-6" />
                                            </div>
                                            {project.tech_stack && (
                                                <div className="px-2.5 py-1 rounded-full bg-secondary/50 border border-secondary text-xs font-medium text-muted-foreground">
                                                    {project.tech_stack.split(',')[0]}
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors line-clamp-1">
                                            {project.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between relative z-10">
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                            {project.description || "No description"}
                                        </p>

                                        <div className="space-y-4">
                                            {/* Stats Row */}
                                            <div className="flex items-center justify-between text-sm">
                                                {/* Pseudo-random member avatars for visual flair */}
                                                <div className="flex items-center -space-x-2">
                                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[10px] text-white font-bold">
                                                        {(project.owner_id || "U").substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {membersCount > 1 && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                            +{membersCount - 1}
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
                                                            {project.created_at ? new Date(project.created_at.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Now'}
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
                    })
                )}
            </div>
        </div>
    );
}
