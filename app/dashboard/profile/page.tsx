"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Calendar,
    Edit2,
    Save,
    X,
    Github,
    Linkedin,
    Globe,
    MapPin,
    Briefcase,
    Award,
    Target,
    Zap,
    Share2
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

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

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        displayName: "",
        email: "",
        bio: "",
        location: "",
        company: "",
        website: "",
        github: "",
        linkedin: "",
        skills: [],
        joinedAt: ""
    });
    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        try {
            const profileRef = doc(db, "users", user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data() as UserProfile;
                setProfile(data);
                setEditedProfile(data);
            } else {
                // Create default profile
                const defaultProfile: UserProfile = {
                    displayName: user.displayName || user.email?.split('@')[0] || "User",
                    email: user.email || "",
                    bio: "",
                    location: "",
                    company: "",
                    website: "",
                    github: "",
                    linkedin: "",
                    skills: [],
                    joinedAt: new Date().toISOString()
                };
                setProfile(defaultProfile);
                setEditedProfile(defaultProfile);
                await setDoc(profileRef, defaultProfile);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const profileRef = doc(db, "users", user.uid);
            await setDoc(profileRef, editedProfile, { merge: true });
            setProfile(editedProfile);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    const displayProfile = isEditing ? editedProfile : profile;

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            {/* Hero Section with Avatar */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                <span className="text-5xl font-bold bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    {displayProfile.displayName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-2">
                                <Input
                                    value={editedProfile.displayName}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                                    placeholder="Your name"
                                    className="text-2xl font-bold bg-background/50 border-white/20"
                                />
                            </div>
                        ) : (
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {profile.displayName}
                            </h1>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                            <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-indigo-400" />
                                    <span className="text-sm font-medium">Active</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-pink-400" />
                                    <span className="text-sm font-medium">Pro</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:bg-white/5"
                                    onClick={() => {
                                        const url = `${window.location.origin}/profile/${user?.uid}`;
                                        navigator.clipboard.writeText(url);
                                        toast.success("Public profile link copied!");
                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="border-white/20 hover:bg-white/5"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-400" />
                            About
                        </h2>
                        {isEditing ? (
                            <Textarea
                                value={editedProfile.bio}
                                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="bg-background/50 border-white/20 resize-none"
                            />
                        ) : (
                            <p className="text-muted-foreground leading-relaxed">
                                {profile.bio || "No bio added yet. Click Edit Profile to add one!"}
                            </p>
                        )}
                    </div>

                    {/* Professional Info */}
                    <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-purple-400" />
                            Professional Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={editedProfile.location}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                                        placeholder="City, Country"
                                        className="bg-background/50 border-white/20"
                                    />
                                ) : (
                                    <p className="text-foreground font-medium">
                                        {profile.location || "Not specified"}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                    <Briefcase className="w-4 h-4" />
                                    Company
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={editedProfile.company}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, company: e.target.value })}
                                        placeholder="Your company"
                                        className="bg-background/50 border-white/20"
                                    />
                                ) : (
                                    <p className="text-foreground font-medium">
                                        {profile.company || "Not specified"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-pink-400" />
                            Social Links
                        </h2>
                        <div className="space-y-4">
                            {/* Website */}
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4" />
                                    Website
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="url"
                                        value={editedProfile.website}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                                        placeholder="https://yourwebsite.com"
                                        className="bg-background/50 border-white/20"
                                    />
                                ) : profile.website ? (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                                    >
                                        {profile.website}
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">Not specified</p>
                                )}
                            </div>

                            {/* GitHub */}
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={editedProfile.github}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, github: e.target.value })}
                                        placeholder="username"
                                        className="bg-background/50 border-white/20"
                                    />
                                ) : profile.github ? (
                                    <a
                                        href={`https://github.com/${profile.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                                    >
                                        @{profile.github}
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">Not specified</p>
                                )}
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={editedProfile.linkedin}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, linkedin: e.target.value })}
                                        placeholder="username"
                                        className="bg-background/50 border-white/20"
                                    />
                                ) : profile.linkedin ? (
                                    <a
                                        href={`https://linkedin.com/in/${profile.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                                    >
                                        @{profile.linkedin}
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">Not specified</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Account Info */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all">
                        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-sm text-muted-foreground mb-1">User ID</p>
                                <p className="text-xs font-mono bg-background/50 p-2 rounded border border-white/10 break-all">
                                    {user?.uid}
                                </p>
                            </div>
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-sm text-muted-foreground mb-1">Email Status</p>
                                <div className="flex items-center gap-2">
                                    {user?.emailVerified ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-green-400">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                            <span className="text-sm text-yellow-400">Not Verified</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                                <p className="text-sm font-medium">
                                    {user?.metadata.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : "Unknown"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
