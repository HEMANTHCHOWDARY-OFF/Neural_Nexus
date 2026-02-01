"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, UserPlus, Code2, Layers, CheckCircle, Clock, Users, Sparkles, Settings, Save, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
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
import { cn } from "@/lib/utils";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string;
    owner_id: string;
    created_at?: any;
}

interface UserProfile {
    id: string;
    displayName: string;
    photoURL?: string;
    skills?: string[];
    role?: string;
}

export default function ProjectIntroPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [matchingUsers, setMatchingUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState<string[]>([]);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "team">("general");
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        tech_stack: ""
    });

    useEffect(() => {
        if (projectId && !authLoading) {
            loadData();
        }
    }, [projectId, authLoading, user]);

    const loadData = async () => {
        if (authLoading) return;

        try {
            // 1. Fetch Project
            const projectRef = doc(db, "projects", projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                const projectData = { id: projectSnap.id, ...projectSnap.data() } as Project;
                setProject(projectData);
                setEditForm({
                    title: projectData.title,
                    description: projectData.description,
                    tech_stack: projectData.tech_stack
                });

                // 2. Fetch Matching Users
                // Only if logged in to avoid permission errors
                if (user) {
                    const usersRef = collection(db, "users");
                    const usersSnap = await getDocs(usersRef);
                    const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as UserProfile[];

                    const potential = allUsers.filter(u => u.id !== user.uid && u.id !== projectData.owner_id);

                    // Mocks
                    if (potential.length < 3) {
                        potential.push(
                            { id: 'mock1', displayName: 'Sarah Chen', role: 'Full Stack Dev', skills: ['React', 'Node.js', 'AWS'] },
                            { id: 'mock2', displayName: 'Alex Rivera', role: 'UI/UX Designer', skills: ['Figma', 'CSS', 'Motion'] },
                            { id: 'mock3', displayName: 'David Kim', role: 'Backend Engineer', skills: ['Python', 'SQL', 'Docker'] },
                            { id: 'mock4', displayName: 'Emily Zhang', role: 'AI Researcher', skills: ['PyTorch', 'TensorFlow'] }
                        );
                    }
                    setMatchingUsers(potential.slice(0, 4));
                } else {
                    setMatchingUsers([
                        { id: 'mock1', displayName: 'Sarah Chen', role: 'Full Stack Dev', skills: ['React', 'Node.js'] },
                        { id: 'mock2', displayName: 'Alex Rivera', role: 'UI/UX Designer', skills: ['Figma', 'CSS'] }
                    ]);
                }
            }
        } catch (error) {
            console.error("Error loading intro data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !user) return;

        setIsUpdating(true);
        try {
            const projectRef = doc(db, "projects", project.id);
            await updateDoc(projectRef, {
                title: editForm.title,
                description: editForm.description,
                tech_stack: editForm.tech_stack
            });

            setProject({ ...project, ...editForm });
            toast.success("Project updated successfully!");
            setIsSettingsOpen(false);
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error("Failed to update project");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSendRequest = async (targetUserId: string) => {
        if (!user) {
            toast.error("Please log in to collaborate");
            return;
        }
        try {
            setRequestSent(prev => [...prev, targetUserId]);
            toast.success("Collaboration request sent!");
        } catch (error) {
            toast.error("Failed to send request");
        }
    };

    const handleEnterWorkspace = () => {
        router.push(`/dashboard/projects/${projectId}/`);
    };

    if (loading || authLoading) return (
        <div className="flex h-screen items-center justify-center bg-zinc-950">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!project) return <div className="p-12 text-center text-red-500">Project not found</div>;

    const isOwner = user?.uid === project.owner_id;
    const timeAgo = project.created_at?.seconds
        ? new Date(project.created_at.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : 'Recently';

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700 bg-zinc-950 min-h-screen text-white">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 shadow-2xl shadow-indigo-500/10">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                                <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">Premium Workspace</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent">
                                {project.title}
                            </h1>
                        </div>

                        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
                            {project.description || "Start building your next big idea. This workspace is ready for code, collaboration, and creativity."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" onClick={handleEnterWorkspace} className="h-14 px-8 text-base rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
                                Enter Code Room
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            {isOwner && (
                                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-white">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Project Settings
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] border-white/10 bg-zinc-950/95 backdrop-blur-xl text-white">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">Project Settings</DialogTitle>
                                            <DialogDescription className="text-zinc-400">
                                                Manage your project configuration and team.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* Simple Tabs */}
                                        <div className="flex gap-4 border-b border-white/10 mb-4">
                                            <button
                                                onClick={() => setActiveTab("general")}
                                                className={cn("pb-2 text-sm font-medium transition-colors border-b-2", activeTab === "general" ? "border-indigo-500 text-white" : "border-transparent text-zinc-400 hover:text-white")}
                                            >
                                                General
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("team")}
                                                className={cn("pb-2 text-sm font-medium transition-colors border-b-2", activeTab === "team" ? "border-indigo-500 text-white" : "border-transparent text-zinc-400 hover:text-white")}
                                            >
                                                Team
                                            </button>
                                        </div>

                                        {activeTab === "general" ? (
                                            <form onSubmit={handleUpdateProject} className="space-y-6 py-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title" className="text-sm font-medium text-zinc-200">
                                                        Project Name
                                                    </Label>
                                                    <Input
                                                        id="title"
                                                        value={editForm.title}
                                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        required
                                                        className="bg-white/5 border-white/10 focus:border-indigo-500/50 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="tech_stack" className="text-sm font-medium text-zinc-200">Tech Stack</Label>
                                                    <Input
                                                        id="tech_stack"
                                                        value={editForm.tech_stack}
                                                        onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value })}
                                                        className="bg-white/5 border-white/10 focus:border-indigo-500/50 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className="text-sm font-medium text-zinc-200">Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="resize-none bg-white/5 border-white/10 focus:border-indigo-500/50 text-white min-h-[100px]"
                                                        rows={4}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                                        {isUpdating ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        ) : (
                                            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                    <Shield className="w-8 h-8 text-zinc-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg text-white">Team Management</h3>
                                                    <p className="text-zinc-400 text-sm max-w-[250px]">
                                                        Advanced roles, permissions, and team member management are coming soon.
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="mt-2 border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                                                    Coming Soon
                                                </Badge>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span>Created {timeAgo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span>Members</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Layers className="w-4 h-4 text-pink-400" />
                                <span>{project.tech_stack || "No Stack"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Visual/Tech Stack */}
                    <div className="relative hidden lg:flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-md">
                            {/* Rotating Ring */}
                            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>

                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-12 hover:rotate-0 transition-all duration-500">
                                    <Code2 className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            {/* Floating Badges */}
                            {project.tech_stack && project.tech_stack.split(',').map((tech, i) => {
                                const angle = (i * (360 / project.tech_stack.split(',').length)) * (Math.PI / 180);
                                const radius = 140; // px
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium shadow-xl hover:scale-110 transition-transform cursor-default text-zinc-300"
                                        style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                                    >
                                        {tech.trim()}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Matching Users Section */}
            <div className="space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Build Your Dream Team</h2>
                        <p className="text-zinc-400 max-w-xl">
                            Based on your project's technology stack, we've found these experts who might be a perfect fit.
                            Connect with them directly.
                        </p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                        View All Candidates
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {matchingUsers.map((match) => (
                        <Card key={match.id} className="group relative overflow-hidden bg-zinc-900/50 border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 hover:bg-green-500/20">98% Match</Badge>
                            </div>

                            <CardContent className="p-6 pt-8 flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className="relative">
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                                    <Avatar className="w-24 h-24 border-4 border-zinc-900 relative">
                                        <AvatarImage src={match.photoURL} />
                                        <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-300">
                                            {match.displayName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{match.displayName}</h3>
                                    <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">
                                        {match.role || "Developer"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 justify-center py-2 h-16 content-start">
                                    {match.skills?.slice(0, 4).map(skill => (
                                        <span key={skill} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-zinc-400 border border-white/5">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <Button
                                    className={`w-full rounded-xl h-10 font-medium transition-all ${requestSent.includes(match.id) ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 ring-1 ring-green-500/50" : "bg-white text-black hover:bg-indigo-50 hover:scale-105"}`}
                                    onClick={() => !requestSent.includes(match.id) && handleSendRequest(match.id)}
                                    disabled={requestSent.includes(match.id)}
                                >
                                    {requestSent.includes(match.id) ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Request Sent
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Recruit
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
