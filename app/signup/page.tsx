"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with name
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
            }
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden selection:bg-primary/30">
            {/* Royal Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-16 h-16 group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                            <Image
                                src="/nexushub-logo-v2.png"
                                alt="NexusHub Logo"
                                fill
                                className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Create an account</CardTitle>
                    <CardDescription className="text-gray-400">Enter your details to join NexusHub</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-primary/50"
                            />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02]" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/10 p-6">
                    <p className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
