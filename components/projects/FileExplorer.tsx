"use client";

import { useState } from "react";
import {
    File,
    Folder,
    FolderOpen,
    Plus,
    Trash2,
    Edit2,
    FileCode,
    FileJson,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    language?: string;
    children?: FileNode[];
    path: string;
}

interface FileExplorerProps {
    files: FileNode[];
    selectedFile: string | null;
    onFileSelect: (file: FileNode) => void;
    onFileCreate: (parentPath: string, type: "file" | "folder") => void;
    onFileDelete: (path: string) => void;
    onFileRename: (path: string, newName: string) => void;
}

export function FileExplorer({
    files,
    selectedFile,
    onFileSelect,
    onFileCreate,
    onFileDelete,
    onFileRename
}: FileExplorerProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]));

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const getFileIcon = (file: FileNode) => {
        if (file.type === "folder") {
            return expandedFolders.has(file.path) ? (
                <FolderOpen className="w-4 h-4 text-amber-500" />
            ) : (
                <Folder className="w-4 h-4 text-amber-500" />
            );
        }

        // File icons based on extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'json':
                return <FileJson className="w-4 h-4 text-yellow-500" />;
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
                return <FileCode className="w-4 h-4 text-blue-500" />;
            case 'md':
            case 'txt':
                return <FileText className="w-4 h-4 text-gray-500" />;
            default:
                return <File className="w-4 h-4 text-gray-400" />;
        }
    };

    const renderFileNode = (node: FileNode, depth: number = 0) => {
        const isExpanded = expandedFolders.has(node.path);
        const isSelected = selectedFile === node.path;

        return (
            <div key={node.path}>
                <div
                    className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
                        isSelected
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-accent text-foreground"
                    )}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    onClick={() => {
                        if (node.type === "folder") {
                            toggleFolder(node.path);
                        } else {
                            onFileSelect(node);
                        }
                    }}
                >
                    {getFileIcon(node)}
                    <span className="flex-1 text-sm truncate">{node.name}</span>

                    {/* Actions */}
                    <div className="hidden group-hover:flex items-center gap-1">
                        {node.type === "folder" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileCreate(node.path, "file");
                                }}
                                className="p-1 hover:bg-primary/20 rounded"
                                title="New file"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const newName = prompt("Rename to:", node.name);
                                if (newName && newName !== node.name) {
                                    onFileRename(node.path, newName);
                                }
                            }}
                            className="p-1 hover:bg-primary/20 rounded"
                            title="Rename"
                        >
                            <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete ${node.name}?`)) {
                                    onFileDelete(node.path);
                                }
                            }}
                            className="p-1 hover:bg-destructive/20 text-destructive rounded"
                            title="Delete"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Render children if folder is expanded */}
                {node.type === "folder" && isExpanded && node.children && (
                    <div>
                        {node.children.map(child => renderFileNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full bg-card border-r border-border overflow-y-auto">
            <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold">Files</h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => onFileCreate("/", "file")}
                        className="p-1.5 hover:bg-accent rounded-md"
                        title="New file"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onFileCreate("/", "folder")}
                        className="p-1.5 hover:bg-accent rounded-md"
                        title="New folder"
                    >
                        <Folder className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-2">
                {files.map(file => renderFileNode(file))}
            </div>
        </div>
    );
}
