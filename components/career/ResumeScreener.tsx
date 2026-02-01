'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeResume, generateInterviewQuestions } from '@/actions/career';
import { db } from '@/lib/firebase';
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle, AlertCircle, MessageSquare, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialState = {
    message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : 'Analyze Resume'}
        </button>
    );
}

const ResumeScreener = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [questions, setQuestions] = useState<any[] | null>(null);
    const [generatingQuestions, setGeneratingQuestions] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const { user } = useAuth();

    // Server Action State
    // @ts-ignore
    const [state, formAction] = useActionState(analyzeResume, initialState);

    useEffect(() => {
        if (state?.success && state.data) {
            setAnalysis(state.data);
            if (user) {
                saveToHistory(state.data, file?.name || 'resume.pdf');
                toast.success('Resume analyzed & saved!');
            } else {
                toast.success('Resume analyzed! (Login to save history)');
            }
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, file, user]);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;

        try {
            const q = query(
                collection(db, 'resume_screenings'),
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
                toast.error('Database index required. Check console for link.');
                console.log('Use this link to create the index:', error.message);
            }
            // Set empty history to prevent UI issues
            setHistory([]);
        }
    };

    const saveToHistory = async (data: any, fileName: string) => {
        if (!user) return;

        try {
            await addDoc(collection(db, 'resume_screenings'), {
                userId: user.uid,
                fileName,
                atsScore: data.atsScore,
                overallScore: data.overallScore,
                keywords: data.keywords,
                feedback: data.feedback,
                createdAt: new Date().toISOString()
            });
            loadHistory();
        } catch (error) {
            console.error('Error saving history:', error);
            toast.error('Failed to save result to history.');
        }
    };

    const generateQuestionsHandler = async () => {
        if (!file) return;

        setGeneratingQuestions(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('difficulty', 'Medium');

        try {
            // @ts-ignore
            const result = await generateInterviewQuestions(null, formData);
            if (result.success) {
                setQuestions(result.questions);
                toast.success('Interview questions generated!');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            toast.error('Failed to generate questions.');
        } finally {
            setGeneratingQuestions(false);
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
                {/* Upload Section */}
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Upload Resume</h2>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-accent/50 transition-colors">
                            <input
                                type="file"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                                <FileText className="w-12 h-12 text-muted-foreground" />
                                <span className="text-primary font-medium">
                                    {file ? file.name : 'Click to upload or drag & drop'}
                                </span>
                                <span className="text-sm text-muted-foreground">PDF, DOCX (max 5MB)</span>
                            </label>
                        </div>

                        {file && <SubmitButton />}
                    </form>
                </div>

                {/* Results Section */}
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Analysis Results</h2>
                    </div>

                    {analysis ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-background rounded-lg border">
                                    <div className="text-3xl font-bold text-primary mb-1">{analysis.atsScore}%</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">ATS Score</div>
                                </div>
                                <div className="text-center p-4 bg-background rounded-lg border">
                                    <div className="text-3xl font-bold text-primary mb-1">{analysis.overallScore}%</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Overall Score</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Feedback
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.feedback?.map((item: string, i: number) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">Detected Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywords?.map((kw: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                            <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                            <p>Upload a resume to see detailed analysis</p>
                        </div>
                    )}

                    {/* Questions Section */}
                    {analysis && (
                        <div className="mt-8 border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    Interview Questions
                                </h3>
                                {!questions && (
                                    <button
                                        onClick={generateQuestionsHandler}
                                        disabled={generatingQuestions}
                                        className="text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {generatingQuestions ? 'Generating...' : 'Generate Questions'}
                                    </button>
                                )}
                            </div>

                            {questions && (
                                <div className="space-y-4">
                                    {questions.map((q, i) => (
                                        <div key={i} className="p-4 bg-muted/30 rounded-lg border">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                                                    {q.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                            <p className="font-medium text-sm">{q.question}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            {
                history.length > 0 && (
                    <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                                        <th className="pb-3 pl-4">Date</th>
                                        <th className="pb-3">File</th>
                                        <th className="pb-3">ATS Score</th>
                                        <th className="pb-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/50">
                                            <td className="py-3 pl-4 text-sm">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 text-sm font-medium">{item.fileName}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                                                    item.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.atsScore}%
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => setAnalysis(item)}
                                                    className="text-primary hover:underline text-sm"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ResumeScreener;
