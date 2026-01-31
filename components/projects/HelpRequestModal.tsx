"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Code,
    Search,
    User,
    CheckCircle2,
    Loader2,
    Globe,
    Zap,
    Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequestSent: (expertName: string) => void;
}

const TOPICS = [
    { id: "react", label: "React / Frontend", icon: Code, color: "text-blue-400" },
    { id: "backend", label: "Node / Backend", icon: Globe, color: "text-green-400" },
    { id: "dsa", label: "DSA / Logic", icon: Zap, color: "text-yellow-400" },
];

const MOCK_EXPERTS = [
    { name: "Sarah Chen", role: "React Expert", xp: 12500, match: 98, status: "online" },
    { name: "Mike Ross", role: "Full Stack Dev", xp: 8900, match: 92, status: "online" },
    { name: "Alex T.", role: "Algorithm Pro", xp: 15400, match: 85, status: "busy" },
];

export function HelpRequestModal({ isOpen, onClose, onRequestSent }: HelpRequestModalProps) {
    const [step, setStep] = useState<"details" | "matching" | "results">("details");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            setStep("details");
            setSelectedTopic("");
            setDescription("");
        }
    }, [isOpen]);

    const handleFindExperts = () => {
        if (!selectedTopic) return;
        setStep("matching");
        // Simulate search delay
        setTimeout(() => {
            setStep("results");
        }, 2000);
    };

    const handleSendRequest = (expertName: string) => {
        onRequestSent(expertName);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        {step === "details" && "Request Help"}
                        {step === "matching" && "Finding Experts..."}
                        {step === "results" && "Matched Experts"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "details" && "Describe your issue to find the best match."}
                        {step === "matching" && "Scanning for available developers with matching skills..."}
                        {step === "results" && "Select an expert to invite to your workspace."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {step === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label>I need help with...</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {TOPICS.map((topic) => (
                                            <div
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic.id)}
                                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 text-center hover:border-primary/50 hover:bg-primary/5 ${selectedTopic === topic.id
                                                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                        : "border-border bg-card"
                                                    }`}
                                            >
                                                <topic.icon className={`w-6 h-6 ${topic.color}`} />
                                                <span className="text-sm font-medium">{topic.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Briefly describe the error or logic issue..."
                                        className="h-24 resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === "matching" && (
                            <motion.div
                                key="matching"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center h-[300px] space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                                    <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-primary animate-spin" />
                                    <Search className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-medium animate-pulse">Scanning network...</h3>
                                    <p className="text-sm text-muted-foreground">Checking skill matches & availability</p>
                                </div>
                            </motion.div>
                        )}

                        {step === "results" && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {MOCK_EXPERTS.map((expert, i) => (
                                    <motion.div
                                        key={expert.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                                                {expert.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-medium flex items-center gap-2">
                                                    {expert.name}
                                                    {expert.status === "online" && (
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
                                                    )}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">{expert.role} • {expert.xp.toLocaleString()} XP</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-bold text-green-400">{expert.match}% Match</span>
                                            <Button
                                                size="sm"
                                                variant={expert.status === 'busy' ? "ghost" : "default"}
                                                disabled={expert.status === 'busy'}
                                                onClick={() => handleSendRequest(expert.name)}
                                                className={expert.status !== 'busy' ? "bg-primary hover:bg-primary/90" : ""}
                                            >
                                                {expert.status === 'busy' ? 'Busy' : 'Request'}
                                                {expert.status !== 'busy' && <Send className="w-3 h-3 ml-2" />}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter>
                    {step === "details" && (
                        <div className="flex w-full justify-between">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleFindExperts} disabled={!selectedTopic}>
                                Find Experts
                            </Button>
                        </div>
                    )}
                    {step === "results" && (
                        <Button variant="ghost" onClick={() => setStep("details")} className="w-full">
                            Search Again
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
