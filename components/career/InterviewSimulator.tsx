'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatInterview } from '@/actions/career';
import { Loader2, Send, User, Bot, Play, MessageSquare, Briefcase, Users, LayoutTemplate, Mic, Volume2, MicOff, StopCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'react-hot-toast';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    feedback?: string;
};

const InterviewSimulator = () => {
    const [started, setStarted] = useState(false);
    const [type, setType] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [voiceMode, setVoiceMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);

                    // Auto-submit for seamless voice interaction
                    // We use a timeout to allow visual confirmation briefly or state update
                    setTimeout(() => {
                        handleVoiceSubmit(transcript);
                    }, 500);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    toast.error('Voice input failed. Please try again.');
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            cancelSpeech();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    // Auto-speak last AI message if voice mode is on
    useEffect(() => {
        if (voiceMode && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'assistant') {
                const textToSpeak = lastMsg.feedback
                    ? `${lastMsg.feedback}. ${lastMsg.content}`
                    : lastMsg.content;
                speak(textToSpeak);
            }
        }
    }, [messages, voiceMode]);

    const speak = (text: string) => {
        cancelSpeech();
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Try to select a good voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const cancelSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            cancelSpeech(); // Stop speaking when listening starts
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const startSession = async (selectedType: string) => {
        setType(selectedType);
        setStarted(true);
        setLoading(true);

        const response = await chatInterview([], selectedType);

        if (response.success && response.data) {
            setMessages([{
                role: 'assistant',
                content: response.data.nextQuestion,
                feedback: response.data.feedback
            }]);
        } else {
            toast.error('Failed to start interview.');
            setStarted(false);
        }
        setLoading(false);
    };

    const handleVoiceSubmit = async (text: string) => {
        if (!text.trim() || loading) return;

        // Optimistic UI update
        const newHistory = [...messages, { role: 'user' as const, content: text }];
        setMessages(newHistory);
        setInput('');
        setLoading(true);

        const apiHistory = newHistory.map(m => ({ role: m.role, content: m.content }));
        const response = await chatInterview(apiHistory, type);

        if (response.success && response.data) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.nextQuestion,
                feedback: response.data.feedback
            }]);
        } else {
            toast.error('Failed to get response.');
        }
        setLoading(false);
    };

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        cancelSpeech(); // Stop previous speech
        const newHistory = [...messages, { role: 'user' as const, content: userMsg }];
        setMessages(newHistory);
        setLoading(true);

        const apiHistory = newHistory.map(m => ({ role: m.role, content: m.content }));
        const response = await chatInterview(apiHistory, type);

        if (response.success && response.data) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.nextQuestion,
                feedback: response.data.feedback
            }]);
        } else {
            toast.error('Failed to get response.');
        }
        setLoading(false);
    };

    if (!started) {
        return (
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            Welcome to NexusHub's AI Interview Simulator!
                        </h1>
                        <p className="text-blue-100 text-lg mb-8">
                            Get instant feedback, track your progress, and improve your skills over time with our realistic AI mock interviews.
                        </p>
                    </div>
                </div>

                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 flex gap-3">
                    <div className="shrink-0 p-1 bg-yellow-100 rounded-full h-fit">
                        <Bot className="w-4 h-4" />
                    </div>
                    <p className="text-sm">
                        <strong>AI Disclaimer:</strong> NavAI is an AI-powered tool and may make mistakes. Use feedback as guidance, not absolute evaluation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        title="Technical Interview"
                        description="Deep dive into coding, system design, and technical concepts."
                        icon={<LayoutTemplate className="w-6 h-6 text-blue-600" />}
                        onClick={() => startSession('Technical')}
                    />
                    <Card
                        title="HR Interview"
                        description="Behavioral questions, culture fit, and soft skills assessment."
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                        onClick={() => startSession('HR Behavioral')}
                    />
                    <Card
                        title="System Design"
                        description="Architecture, scalability, and high-level design discussions."
                        icon={<Briefcase className="w-6 h-6 text-emerald-600" />}
                        onClick={() => startSession('System Design')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-card border rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        {type} Interview
                    </span>
                    <button
                        onClick={() => {
                            setVoiceMode(!voiceMode);
                            cancelSpeech();
                        }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                            voiceMode ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                    >
                        {voiceMode ? <Volume2 className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                        {voiceMode ? "Voice On" : "Voice Off"}
                    </button>
                </div>
                <button onClick={() => setStarted(false)} className="text-sm text-muted-foreground hover:text-red-500 transition-colors">
                    End Session
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-4 max-w-4xl mx-auto", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}

                        <div className={cn(
                            "rounded-2xl p-5 shadow-sm max-w-[80%]",
                            msg.role === 'user'
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-accent/50 border border-border rounded-tl-none"
                        )}>
                            {msg.feedback && (
                                <div className="mb-3 text-sm bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-lg border border-green-500/20">
                                    <strong>Feedback:</strong> {msg.feedback}
                                </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 shadow">
                                <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4 max-w-4xl mx-auto">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-accent/50 border border-border rounded-2xl rounded-tl-none p-5 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background shrink-0">
                <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Type your answer..."}
                            className={cn(
                                "w-full p-4 pr-12 rounded-xl border outline-none transition-all shadow-inner",
                                isListening ? "bg-red-50 border-red-200 ring-2 ring-red-100 pl-10" : "bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary"
                            )}
                            disabled={loading}
                            autoFocus
                        />
                        {isListening && <Mic className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />}

                        {voiceMode && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
                                    isListening ? "text-red-500 bg-red-100 hover:bg-red-200" : "text-gray-500 hover:bg-gray-200"
                                )}
                                title="Toggle Microphone"
                            >
                                {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

function Card({ title, description, icon, onClick }: any) {
    return (
        <div onClick={onClick} className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
            <div className="mb-4 p-3 bg-accent rounded-lg w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );
}

export default InterviewSimulator;
