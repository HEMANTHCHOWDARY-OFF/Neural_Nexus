"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CodeEditor } from "@/components/projects/CodeEditor";
import { FileExplorer } from "@/components/projects/FileExplorer";
import { Whiteboard } from "@/components/projects/Whiteboard";
import { Button } from "@/components/ui/button";
import { Save, Play, Users, MessageSquare, Palette, CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { HelpRequestModal } from "@/components/projects/HelpRequestModal";

interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    language?: string;
    children?: FileNode[];
    path: string;
}

interface ProjectFile {
    id: number;
    filename: string;
    filepath: string;
    language: string;
    content: string;
}

type Tab = "code" | "whiteboard" | "chat" | "team";

export default function ProjectDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const projectId = params.id as string;

    const [activeTab, setActiveTab] = useState<Tab>("code");
    const [files, setFiles] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [currentContent, setCurrentContent] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState("javascript");
    const [saving, setSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);

    const isDemo = projectId.startsWith('demo-');

    useEffect(() => {
        if (projectId) {
            loadFiles();
        }
    }, [projectId]);

    useEffect(() => {
        if (isDemo) {
            import('react-hot-toast').then(({ toast }) => {
                setTimeout(() => {
                    toast.success("Joined live session: Room #802386", {
                        icon: '🟢',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }, 1000);
            });
        }
    }, [isDemo]);

    const loadFiles = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/files`);
            if (res.ok) {
                const data: ProjectFile[] = await res.json();
                const fileTree = buildFileTree(data);
                setFiles(fileTree);

                // Select first file by default
                if (data.length > 0 && !selectedFile) {
                    setSelectedFile(data[0].filepath);
                    setCurrentContent(data[0].content || "");
                    setCurrentLanguage(data[0].language || "javascript");
                }
            }
        } catch (error) {
            console.error("Error loading files:", error);
        }
    };

    const buildFileTree = (files: ProjectFile[]): FileNode[] => {
        const root: FileNode[] = [];

        files.forEach(file => {
            root.push({
                id: file.id.toString(),
                name: file.filename,
                type: "file",
                language: file.language,
                path: file.filepath,
            });
        });

        return root;
    };

    const handleFileSelect = async (file: FileNode) => {
        if (file.type === "file") {
            setSelectedFile(file.path);

            // Load file content
            try {
                const res = await fetch(`/api/projects/${projectId}/files`);
                if (res.ok) {
                    const data: ProjectFile[] = await res.json();
                    const fileData = data.find(f => f.filepath === file.path);
                    if (fileData) {
                        setCurrentContent(fileData.content || "");
                        setCurrentLanguage(fileData.language || "javascript");
                    }
                }
            } catch (error) {
                console.error("Error loading file:", error);
            }
        }
    };

    const handleSave = async () => {
        if (!selectedFile || !user) return;

        setSaving(true);
        try {
            const filename = selectedFile.split('/').pop() || 'untitled';
            const res = await fetch(`/api/projects/${projectId}/files`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename,
                    filepath: selectedFile,
                    language: currentLanguage,
                    content: currentContent,
                    user_id: user.uid,
                }),
            });

            if (res.ok) {
                console.log("File saved successfully");
            }
        } catch (error) {
            console.error("Error saving file:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleFileCreate = async (parentPath: string, type: "file" | "folder") => {
        const name = prompt(`Enter ${type} name:`);
        if (!name || !user) return;

        const filepath = parentPath === "/" ? `/${name}` : `${parentPath}/${name}`;
        const language = name.split('.').pop() || 'plaintext';

        try {
            const res = await fetch(`/api/projects/${projectId}/files`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: name,
                    filepath,
                    language,
                    content: "",
                    user_id: user.uid,
                }),
            });

            if (res.ok) {
                loadFiles();
            }
        } catch (error) {
            console.error("Error creating file:", error);
        }
    };

    const handleFileDelete = async (path: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/files?filepath=${encodeURIComponent(path)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                loadFiles();
                if (selectedFile === path) {
                    setSelectedFile(null);
                    setCurrentContent("");
                }
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const handleFileRename = async (path: string, newName: string) => {
        // TODO: Implement rename functionality
        console.log("Rename not yet implemented");
    };

    const handleRun = () => {
        setIsRunning(true);
        import('react-hot-toast').then(({ toast }) => {
            if (isDemo) {
                toast.loading("Compiling...", { id: 'run-toast' });
                setTimeout(() => {
                    toast.dismiss('run-toast');
                    toast.success("Build Successful! Server running on port 3000", { duration: 4000 });
                    setIsRunning(false);
                }, 2000);
            } else {
                // Real run logic would go here
                setTimeout(() => {
                    setIsRunning(false);
                    toast.error("Execution environment not connected");
                }, 1000);
            }
        });
    };

    const tabs = [
        { id: "code" as Tab, label: "Code", icon: Save },
        { id: "whiteboard" as Tab, label: "Whiteboard", icon: Palette },
        { id: "chat" as Tab, label: "Chat", icon: MessageSquare },
        { id: "team" as Tab, label: "Team", icon: Users },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-border bg-card p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Project Workspace</h1>
                    <div className="flex gap-2">
                        {/* Solved Button (Gamification) */}
                        {isDemo && (
                            <Button
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20"
                                onClick={() => {
                                    import('canvas-confetti').then((confetti) => {
                                        confetti.default({
                                            particleCount: 100,
                                            spread: 70,
                                            origin: { y: 0.6 }
                                        });
                                    });
                                    import('react-hot-toast').then(({ toast }) => {
                                        toast.success("Issue Solved! +50 XP", {
                                            icon: '🎉',
                                            style: {
                                                background: '#10B981',
                                                color: '#fff',
                                            }
                                        });
                                    });
                                }}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark Solved
                            </Button>
                        )}

                        {/* Request Help Button (Main Feature) */}
                        <Button
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 border-0"
                            onClick={() => setHelpModalOpen(true)}
                        >
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                            Request Help
                        </Button>

                        <Button onClick={handleSave} disabled={saving || !selectedFile} variant="secondary">
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleRun} disabled={isRunning} className={isRunning ? "opacity-80" : ""}>
                            <Play className={`w-4 h-4 mr-2 ${isRunning ? "text-green-500" : ""}`} fill={isRunning ? "currentColor" : "none"} />
                            {isRunning ? "Running..." : "Run"}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {activeTab === "code" && (
                    <>
                        {/* File Explorer */}
                        <div className="w-64 flex-shrink-0">
                            <FileExplorer
                                files={files}
                                selectedFile={selectedFile}
                                onFileSelect={handleFileSelect}
                                onFileCreate={handleFileCreate}
                                onFileDelete={handleFileDelete}
                                onFileRename={handleFileRename}
                            />
                        </div>

                        {/* Editor */}
                        <div className="flex-1 p-4">
                            {selectedFile ? (
                                <CodeEditor
                                    value={currentContent}
                                    onChange={(value) => setCurrentContent(value || "")}
                                    language={currentLanguage}
                                    height="calc(100vh - 200px)"
                                    isDemoMode={isDemo}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Select a file to start editing
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "whiteboard" && (
                    <div className="flex-1">
                        <Whiteboard projectId={projectId} />
                    </div>
                )}

                {activeTab === "chat" && (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Chat coming soon...
                    </div>
                )}

                {activeTab === "team" && (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Team management coming soon...
                    </div>
                )}
            </div>

            <HelpRequestModal
                isOpen={helpModalOpen}
                onClose={() => setHelpModalOpen(false)}
                onRequestSent={(expert) => {
                    import('react-hot-toast').then(({ toast }) => {
                        toast.success(`Request sent to ${expert}`, { icon: '📨' });
                        setTimeout(() => {
                            toast.success(`${expert} joined your workspace!`, {
                                icon: '👋',
                                duration: 4000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    border: '1px solid #333'
                                }
                            });
                            // Force demo mode effectively (handled by isDemo logic currently, but could be state based)
                        }, 3000);
                    });
                }}
            />
        </div>
    );
}
