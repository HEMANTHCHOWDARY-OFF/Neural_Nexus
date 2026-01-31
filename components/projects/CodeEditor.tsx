"use client";

import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
    height?: string;
}

export function CodeEditor({
    value,
    onChange,
    language = "javascript",
    readOnly = false,
    height = "600px",
    isDemoMode = false
}: CodeEditorProps & { isDemoMode?: boolean }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [editor, setEditor] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simulated Collaboration Logic
    useEffect(() => {
        if (!editor || !isDemoMode) return;

        let decorations: string[] = [];
        let interval: NodeJS.Timeout;

        // Define the ghost cursor style
        const cursorStyle = {
            className: 'ghost-cursor',
            glyphMarginClassName: 'ghost-cursor-glyph',
            hoverMessage: { value: 'Sarah (AI Team Member)' }
        };

        const updateCursor = () => {
            if (!editor) return;

            const model = editor.getModel();
            if (!model) return;

            const lineCount = model.getLineCount();
            const randomLine = Math.floor(Math.random() * lineCount) + 1;
            const randomCol = Math.floor(Math.random() * model.getLineMaxColumn(randomLine)) + 1;

            const newDecorations = [
                {
                    range: {
                        startLineNumber: randomLine,
                        startColumn: randomCol,
                        endLineNumber: randomLine,
                        endColumn: randomCol
                    },
                    options: {
                        className: 'peer-cursor',
                        hoverMessage: { value: 'Sarah (AI)' },
                        beforeContentClassName: 'peer-cursor-label',
                    }
                }
            ];

            decorations = editor.deltaDecorations(decorations, newDecorations);
        };

        // Start simulation
        interval = setInterval(updateCursor, 2500); // Move every 2.5s

        // Inject CSS for the cursor if not exists
        const styleId = 'monaco-ghost-cursor-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .peer-cursor {
                    border-left: 2px solid #a855f7;
                    background: rgba(168, 85, 247, 0.2);
                }
                .peer-cursor-label::before {
                    content: "Sarah (AI)";
                    position: absolute;
                    top: -18px;
                    left: 0;
                    background: #a855f7;
                    color: white;
                    font-size: 10px;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-family: sans-serif;
                    z-index: 10;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }

        return () => {
            clearInterval(interval);
            if (editor) {
                editor.deltaDecorations(decorations, []);
            }
        };
    }, [editor, isDemoMode]);

    const handleEditorDidMount = (editorInstance: any) => {
        setEditor(editorInstance);
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg" style={{ height }}>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden relative">
            {isDemoMode && (
                <div className="absolute top-2 right-4 z-10 bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium border border-green-500/20 backdrop-blur-sm pointer-events-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    1 Teammate Online
                </div>
            )}
            <Editor
                height={height}
                language={language}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                    readOnly,
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    formatOnPaste: true,
                    formatOnType: true,
                }}
                loading={
                    <div className="flex items-center justify-center h-full bg-muted/50">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }
            />
        </div>
    );
}
