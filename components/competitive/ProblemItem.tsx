import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProblemItemProps {
    problem: {
        id: string;
        name: string;
        completed: boolean;
    };
    onToggle: (id: string) => void;
    onSelect: () => void;
}

const ProblemItem = ({ problem, onToggle, onSelect }: ProblemItemProps) => {
    const { id, name, completed } = problem;

    return (
        <div
            className={`cp-problem-item ${completed ? 'completed' : ''} group`}
            onClick={onSelect}
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Problem ID Badge */}
                <div className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                    <span className="text-xs font-mono font-semibold text-primary">{id}</span>
                </div>

                {/* Problem Name */}
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {name}
                </span>
            </div>

            {/* Checkbox */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (!completed) onToggle(id);
                }}
                className="cursor-pointer"
            >
                {completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                )}
            </div>
        </div>
    );
};

export default ProblemItem;
