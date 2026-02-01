"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
    User, Mail, Calendar, MapPin, Briefcase, Globe, Github, Linkedin,
    Award, Target, Zap, Share2
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface UserProfile {
    displayName: string;
    email: string;
    bio: string;
    location: string;
    company: string;
    website: string;
    github: string;
    linkedin: string;
    skills: string[];
    joinedAt: string;
}

export default function PublicProfilePage() {
    const params = useParams();
    const userId = params?.id as string;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            const profileRef = doc(db, "users", userId);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setProfile(profileSnap.data() as UserProfile);
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <h1 className="text-2xl font-bold text-white">User not found</h1>
                <p className="text-gray-400">The profile you are looking for does not exist.</p>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4">
            <Toaster position="top-center" />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 p-8 sm:p-12">
                    <div className="relative flex flex-col md:flex-row items-center gap-8 z-10">
                        {/* Avatar */}
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <span className="text-5xl font-bold text-white">
                                    {profile.displayName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {profile.displayName}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400">
                                {profile.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.company && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{profile.company}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <Button onClick={handleShare} className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-400" /> Socials
                            </h3>
                            <div className="space-y-3">
                                {profile.website && (
                                    <a href={profile.website} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                        <Globe className="w-4 h-4" /> Website
                                    </a>
                                )}
                                {profile.github && (
                                    <a href={`https://github.com/${profile.github}`} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                        <Github className="w-4 h-4" /> GitHub
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-400" /> About
                            </h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {profile.bio || "This user hasn't added a bio yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
