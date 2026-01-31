'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { generateInterviewQuestions } from '@/actions/career';
import { useAuth } from "@/context/AuthContext";
import { Loader2, Zap, FileText, ChevronRight, HelpCircle, PenTool, LayoutTemplate } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { cn } from "@/lib/utils";

const initialState = {
    message: null,
};

function SubmitButton({ label = 'Generate Questions', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
    // @ts-ignore
    const { pending } = React.useFormStatus ? React.useFormStatus() : { pending: false };
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            {...props}
        >
            {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : label}
        </button>
    );
}

const AIInterview = () => {
    const [file, setFile] = useState<File | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [mode, setMode] = useState<'resume' | 'manual'>('resume');
    const { user } = useAuth();

    // @ts-ignore
    const [state, formAction] = useActionState(generateInterviewQuestions, initialState);

    useEffect(() => {
        if (state?.success && state.questions) {
            setQuestions(state.questions);
            if (user) {
                saveToHistory(state.questions);
                toast.success('Interview questions generated!');
            } else {
                toast.success('Questions generated!');
            }
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, user]);

    useEffect(() => {
        if (user) loadHistory();
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'ai_interviews'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(data);
        } catch (error: any) {
            console.error('Error loading history:', error);
            if (error.code === 'permission-denied') {
                toast.error('Unable to load history. Please check Firebase permissions.');
            } else if (error.code === 'failed-precondition') {
                toast.error('Database index required. Please contact support.');
            }
            // Set empty history to prevent UI issues
            setHistory([]);
        }
    };

    const saveToHistory = async (questionsData: any[]) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'ai_interviews'), {
                userId: user.uid,
                questions: questionsData,
                createdAt: new Date().toISOString()
            });
            loadHistory();
        } catch (error) {
            console.error('Error saving history:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-lg">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-semibold">AI Interview Prep</h2>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg">
                        <button
                            onClick={() => setMode('resume')}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                                mode === 'resume' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                            )}
                        >
                            <FileText className="w-4 h-4" /> Import Resume
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                                mode === 'manual' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                            )}
                        >
                            <PenTool className="w-4 h-4" /> Manual Topic
                        </button>
                    </div>

                    <form action={formAction} className="space-y-6">
                        {mode === 'resume' ? (
                            <>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Upload your resume to get tailored technical and behavioral questions specific to your experience.
                                </p>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-accent/50 transition-colors">
                                    <input
                                        type="file"
                                        name="resume"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="interview-resume-upload-input"
                                    />
                                    <label htmlFor="interview-resume-upload-input" className="cursor-pointer flex flex-col items-center gap-3">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                        <span className="text-primary font-medium">
                                            {file ? file.name : 'Click to upload resume'}
                                        </span>
                                        <span className="text-sm text-muted-foreground">PDF, DOCX (max 5MB)</span>
                                    </label>
                                </div>
                                {file && <SubmitButton label="Generate from Resume" formNoValidate />}
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Manually specify a job role or topic to generate relevant interview questions.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Job Role / Topic</label>
                                        <input
                                            type="text"
                                            name="role"
                                            placeholder="e.g. Java Developer, HR, Data Science"
                                            className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Specific Focus (Optional)</label>
                                        <textarea
                                            name="topic"
                                            placeholder="e.g. Focus on Spring Boot, problem solving, leadership..."
                                            className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Difficulty</label>
                                            <select name="difficulty" defaultValue="Medium" className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Count</label>
                                            <select name="count" className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                                <option value="3">3 Questions</option>
                                                <option value="5" selected>5 Questions</option>
                                                <option value="10">10 Questions</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <SubmitButton label="Generate Questions" />
                            </>
                        )}
                    </form>
                </div>

                {/* Questions Output */}
                <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" /> Generated Questions
                    </h2>

                    {questions.length > 0 ? (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {questions.map((q, i) => (
                                <div key={i} className="p-4 rounded-lg bg-accent/30 border border-border">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                                            {q.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <p className="font-medium text-lg mb-2">{q.question}</p>
                                    {q.basedOn && (
                                        <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                                            Based on: {q.basedOn}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground text-center">
                            <Zap className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select context to start generating questions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Past Sessions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setQuestions(item.questions)}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {item.questions?.length || 0} Questions Generated
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIInterview;
