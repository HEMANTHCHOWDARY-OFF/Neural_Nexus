import React, { useEffect } from 'react';

interface ProblemModalProps {
    problem: {
        id: string;
        name: string;
        description: string;
        completed: boolean;
    } | null;
    onClose: () => void;
}

const ProblemModal = ({ problem, onClose }: ProblemModalProps) => {
    if (!problem) return null;

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="cp-modal-overlay" onClick={onClose}>
            <div className="cp-modal-content" onClick={e => e.stopPropagation()}>
                <div className="cp-modal-header">
                    <h2 className="cp-heading" style={{ fontSize: '1.5rem', marginBottom: 0 }}>
                        {problem.id}. {problem.name}
                    </h2>
                    <button className="cp-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="cp-modal-body">
                    <p className="cp-text-sub" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                        {problem.description}
                    </p>
                </div>

                <div className="cp-modal-footer">
                    <div className="cp-tag">
                        {problem.completed ? '✅ Completed' : 'Unsolved'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemModal;
