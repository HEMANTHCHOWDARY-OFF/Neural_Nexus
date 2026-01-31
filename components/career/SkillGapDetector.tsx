'use client';

import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Target,
    TrendingUp,
    Award,
    BookOpen,
    ArrowRight,
    ChevronDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Job Role Data
const ROLES = {
    'Frontend Developer': {
        icon: '🎨',
        skills: ['HTML/CSS', 'JavaScript', 'React.js', 'TypeScript', 'Tailwind CSS', 'Git', 'Responsive Design', 'API Integration']
    },
    'Backend Developer': {
        icon: '⚙️',
        skills: ['Node.js', 'Express.js', 'SQL/PostgreSQL', 'MongoDB', 'REST APIs', 'Authentication', 'Docker', 'Git']
    },
    'Full Stack Developer': {
        icon: '🚀',
        skills: ['JavaScript', 'React.js', 'Node.js', 'Database Architecture', 'DevOps Basics', 'Git', 'System Design']
    },
    'Data Scientist': {
        icon: '📊',
        skills: ['Python', 'Pandas/NumPy', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics', 'Jupyter', 'Big Data']
    },
    'UI/UX Designer': {
        icon: '✨',
        skills: ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'Color Theory', 'Typography', 'Accessibility', 'Interaction Design']
    },
    'DevOps Engineer': {
        icon: '♾️',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/Cloud', 'Linux', 'Scripting (Bash/Python)', 'Monitoring', 'Terraform']
    }
};

const SkillGapDetector = () => {
    const [selectedRole, setSelectedRole] = useState<string>('Frontend Developer');
    const [userSkills, setUserSkills] = useState<string[]>([]);

    const roleData = ROLES[selectedRole as keyof typeof ROLES];

    // Calculations
    const totalSkills = roleData.skills.length;
    const matchedSkills = roleData.skills.filter(s => userSkills.includes(s));
    const missingSkills = roleData.skills.filter(s => !userSkills.includes(s));
    const score = Math.round((matchedSkills.length / totalSkills) * 100);

    const toggleSkill = (skill: string) => {
        if (userSkills.includes(skill)) {
            setUserSkills(userSkills.filter(s => s !== skill));
        } else {
            setUserSkills([...userSkills, skill]);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        Skill Gap Detector
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Analyze your skillset against industry standards and find your path to growth.
                    </p>
                </div>

                {/* Role Selector */}
                <div className="relative min-w-[280px]">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full flex items-center justify-between pl-4 pr-4 py-3 bg-card border border-border rounded-xl shadow-sm hover:bg-accent/5 transition-colors text-base font-medium outline-none focus:ring-2 focus:ring-blue-500">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{ROLES[selectedRole as keyof typeof ROLES].icon}</span>
                                <span>{selectedRole}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] p-1" align="start">
                            {Object.keys(ROLES).map((role) => (
                                <DropdownMenuItem
                                    key={role}
                                    onClick={() => {
                                        setSelectedRole(role);
                                        setUserSkills([]);
                                    }}
                                    className="flex items-center gap-3 p-3 cursor-pointer text-base rounded-lg focus:bg-accent focus:text-accent-foreground"
                                >
                                    <span className="text-xl">{ROLES[role as keyof typeof ROLES].icon}</span>
                                    {role}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Checklist */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-card rounded-2xl border shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                            {roleData.icon} {selectedRole} Requirements
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roleData.skills.map(skill => {
                                const isOwned = userSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.01]",
                                            isOwned
                                                ? "border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400"
                                                : "border-border hover:border-blue-400/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                                        )}
                                    >
                                        <span className="font-medium">{skill}</span>
                                        {isOwned ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/20" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-blue-400 transition-colors" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Analysis */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Score Card */}
                    <div className="bg-card rounded-2xl border shadow-sm p-8 text-center relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${score === 100 ? 'from-green-500/10 to-emerald-500/10' :
                            score >= 70 ? 'from-blue-500/10 to-violet-500/10' :
                                'from-orange-500/10 to-red-500/10'
                            } transition-colors duration-500`}
                        />

                        <div className="relative">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Match Score</span>
                            <div className="text-6xl font-black mt-4 mb-2 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                                {score}%
                            </div>

                            {/* Detailed Progress Bar */}
                            <div className="w-full h-3 bg-muted rounded-full mt-6 overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                        score === 100 ? "bg-green-500" :
                                            score >= 70 ? "bg-blue-600" :
                                                "bg-orange-500"
                                    )}
                                    style={{ width: `${score}%` }}
                                />
                            </div>

                            <p className="mt-4 text-muted-foreground font-medium">
                                {score === 100 ? "🎉 Perfect Match! You're ready." :
                                    score >= 75 ? "🚀 Great fit! Polishing needed." :
                                        "📚 Growing potential. Keep learning!"}
                            </p>
                        </div>
                    </div>

                    {/* Missing Skills / Recommendations */}
                    <div className="bg-card rounded-2xl border shadow-sm p-6 h-fit">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            {missingSkills.length === 0 ? <Award className="w-5 h-5 text-green-500" /> : <TrendingUp className="w-5 h-5 text-orange-500" />}
                            {missingSkills.length === 0 ? "You're All Set!" : "Action Plan"}
                        </h3>

                        {missingSkills.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground mb-2">Focus on learning these specific skills to close the gap:</p>
                                {missingSkills.map(skill => (
                                    <div key={skill} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 group hover:shadow-sm transition-all">
                                        <XCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                                        <span className="font-medium text-sm flex-1">{skill}</span>
                                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Learn <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-green-600 mb-1">Expert Level Reached</h4>
                                <p className="text-sm text-muted-foreground">You have all the required skills for this role.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillGapDetector;
