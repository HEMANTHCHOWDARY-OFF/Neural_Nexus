"use client";

import { useEffect, useRef, useState } from 'react';
import { Pencil, Eraser, Square, Circle, Type, Trash2, Download, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingElement {
    type: 'path' | 'line' | 'rectangle' | 'circle' | 'text';
    color: string;
    width: number;
    points?: { x: number; y: number }[];
    x?: number;
    y?: number;
    x2?: number;
    y2?: number;
    radius?: number;
    text?: string;
}

interface WhiteboardProps {
    projectId: string;
}

export function Whiteboard({ projectId }: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text'>('pen');
    const [color, setColor] = useState('#3b82f6');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    useEffect(() => {
        loadWhiteboard();
    }, [projectId]);

    useEffect(() => {
        redrawCanvas();
    }, [elements]);

    const loadWhiteboard = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/whiteboard`);
            if (res.ok) {
                const data = await res.json();
                setElements(data.drawing_data || []);
            }
        } catch (err) {
            console.error('Failed to load whiteboard:', err);
        }
    };

    const saveWhiteboard = async (newElements: DrawingElement[]) => {
        try {
            await fetch(`/api/projects/${projectId}/whiteboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ drawing_data: newElements })
            });
        } catch (err) {
            console.error('Failed to save whiteboard:', err);
        }
    };

    const clearWhiteboard = async () => {
        if (!confirm('Clear the entire whiteboard?')) return;
        setElements([]);
        await fetch(`/api/projects/${projectId}/whiteboard`, { method: 'DELETE' });
        redrawCanvas();
    };

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas with theme-aware background
        ctx.fillStyle = 'hsl(var(--background))';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all elements
        elements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (element.type === 'path' && element.points) {
                ctx.beginPath();
                element.points.forEach((point, i) => {
                    if (i === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            } else if (element.type === 'line' && element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
                ctx.beginPath();
                ctx.moveTo(element.x, element.y);
                ctx.lineTo(element.x2, element.y2);
                ctx.stroke();
            } else if (element.type === 'rectangle' && element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
                ctx.strokeRect(element.x, element.y, element.x2 - element.x, element.y2 - element.y);
            } else if (element.type === 'circle' && element.x !== undefined && element.y !== undefined && element.radius !== undefined) {
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (element.type === 'text' && element.x !== undefined && element.y !== undefined && element.text) {
                ctx.fillStyle = element.color;
                ctx.font = `${element.width * 8}px sans-serif`;
                ctx.fillText(element.text, element.x, element.y);
            }
        });
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        setIsDrawing(true);
        setStartPos(pos);

        if (tool === 'pen' || tool === 'eraser') {
            const newElement: DrawingElement = {
                type: 'path',
                color: tool === 'eraser' ? 'hsl(var(--background))' : color,
                width: tool === 'eraser' ? strokeWidth * 3 : strokeWidth,
                points: [pos]
            };
            setCurrentElement(newElement);
        } else if (tool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const newElement: DrawingElement = {
                    type: 'text',
                    color,
                    width: strokeWidth,
                    x: pos.x,
                    y: pos.y,
                    text
                };
                const newElements = [...elements, newElement];
                setElements(newElements);
                saveWhiteboard(newElements);
            }
            setIsDrawing(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPos) return;

        const pos = getMousePos(e);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        if (tool === 'pen' || tool === 'eraser') {
            if (currentElement && currentElement.points) {
                const updated = { ...currentElement, points: [...currentElement.points, pos] };
                setCurrentElement(updated);

                // Draw current stroke
                ctx.strokeStyle = updated.color;
                ctx.lineWidth = updated.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                const points = updated.points;
                if (points.length > 1) {
                    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
                    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                    ctx.stroke();
                }
            }
        } else {
            // Preview for shapes
            redrawCanvas();
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeWidth;

            if (tool === 'line') {
                ctx.beginPath();
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (tool === 'rectangle') {
                ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
                ctx.beginPath();
                ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPos) return;

        const pos = getMousePos(e);
        let newElement: DrawingElement | null = null;

        if (tool === 'pen' || tool === 'eraser') {
            newElement = currentElement;
        } else if (tool === 'line') {
            newElement = {
                type: 'line',
                color,
                width: strokeWidth,
                x: startPos.x,
                y: startPos.y,
                x2: pos.x,
                y2: pos.y
            };
        } else if (tool === 'rectangle') {
            newElement = {
                type: 'rectangle',
                color,
                width: strokeWidth,
                x: startPos.x,
                y: startPos.y,
                x2: pos.x,
                y2: pos.y
            };
        } else if (tool === 'circle') {
            const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
            newElement = {
                type: 'circle',
                color,
                width: strokeWidth,
                x: startPos.x,
                y: startPos.y,
                radius
            };
        }

        if (newElement) {
            const newElements = [...elements, newElement];
            setElements(newElements);
            saveWhiteboard(newElements);
        }

        setIsDrawing(false);
        setCurrentElement(null);
        setStartPos(null);
    };

    const downloadWhiteboard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `whiteboard-${projectId}.png`;
        a.click();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="bg-card border-b border-border p-3 flex items-center gap-4 flex-wrap">
                {/* Tools */}
                <div className="flex items-center gap-2 border-r border-border pr-4">
                    <button
                        onClick={() => setTool('pen')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'pen' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Pen"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>
                    <button
                        onClick={() => setTool('line')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'line' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Line"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        onClick={() => setTool('rectangle')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'rectangle' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Rectangle"
                    >
                        <Square size={18} />
                    </button>
                    <button
                        onClick={() => setTool('circle')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'circle' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Circle"
                    >
                        <Circle size={18} />
                    </button>
                    <button
                        onClick={() => setTool('text')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            tool === 'text' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                        )}
                        title="Text"
                    >
                        <Type size={18} />
                    </button>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2 border-r border-border pr-4">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={cn(
                                "w-7 h-7 rounded border-2 transition-transform",
                                color === c ? 'border-foreground scale-110' : 'border-border'
                            )}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>

                {/* Stroke Width */}
                <div className="flex items-center gap-2 border-r border-border pr-4">
                    <span className="text-xs text-muted-foreground">Width:</span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-24"
                    />
                    <span className="text-xs w-6">{strokeWidth}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={downloadWhiteboard}
                        className="p-2 rounded bg-muted hover:bg-muted/80 flex items-center gap-2 px-3 text-sm"
                        title="Download"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                    <button
                        onClick={clearWhiteboard}
                        className="p-2 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 flex items-center gap-2 px-3 text-sm"
                        title="Clear"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-muted/20">
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        if (isDrawing) handleMouseUp({} as any);
                    }}
                    className="border border-border cursor-crosshair shadow-2xl rounded-lg bg-background"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
            </div>
        </div>
    );
}
