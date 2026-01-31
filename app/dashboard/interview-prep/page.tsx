"use client";

import { Video, Award, PlayCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InterviewPrepPage() {
    const videos = [
        {
            id: 'W1i_sDLaiyo',
            title: 'TOP 3 JOB INTERVIEW MISTAKES YOU MUST AVOID!',
            description: 'Learn the top 3 critical mistakes candidates make during job interviews and how to avoid them to increase your chances of success.',
            link: 'https://youtu.be/W1i_sDLaiyo',
            icon: '⚠️',
            color: 'from-amber-400 to-orange-500'
        },
        {
            id: 'QYJUUtYbZD4',
            title: 'JOB INTERVIEW TIPS!',
            description: 'Essential job interview tips to help you prepare effectively and make a great impression on your interviewer.',
            link: 'https://youtu.be/QYJUUtYbZD4',
            icon: '💡',
            color: 'from-yellow-400 to-amber-400'
        },
        {
            id: 'G0deQTjNpQo',
            title: 'HOW TO PREPARE FOR AN INTERVIEW! (5 EASY-STEPS)',
            description: 'A comprehensive 5-step guide to prepare for job interviews in 2025 and increase your chances of getting hired.',
            link: 'https://youtu.be/G0deQTjNpQo',
            icon: '📋',
            color: 'from-emerald-400 to-green-500'
        },
        {
            id: 'BpP_tOZAPjg',
            title: 'Interview Tips For Freshers',
            description: 'Specially designed interview preparation guide for freshers with common questions and effective answers.',
            link: 'https://youtu.be/BpP_tOZAPjg',
            icon: '🎓',
            color: 'from-blue-400 to-indigo-500'
        },
        {
            id: '03lUEpWg8OM',
            title: 'Top 10 Interview Questions and QUICK Answers',
            description: 'Master the top 10 most common interview questions with quick, effective answers that will help you ace your next interview.',
            link: 'https://youtu.be/03lUEpWg8OM',
            icon: '🎯',
            color: 'from-purple-400 to-pink-500'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Interview Prep
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Master your interview skills with expert-led strategies.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="font-medium">{videos.length} Videos Available</span>
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                    <Card key={video.id} className="group relative overflow-hidden border-border/50 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${video.color} flex items-center justify-center text-2xl shadow-lg ring-2 ring-background`}>
                                    {video.icon}
                                </div>
                                <div className="px-2.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                                    Part {index + 1}
                                </div>
                            </div>
                            <CardTitle className="mt-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                                {video.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {video.description}
                            </p>

                            <Button
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md group-hover:shadow-lg transition-all"
                                asChild
                            >
                                <a href={video.link} target="_blank" rel="noopener noreferrer">
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    Watch Video
                                    <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
