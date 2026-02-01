"use client";

import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle,
  TreePine,
  Folder,
  Users,
  FileText,
  Trophy,
  ArrowRight,
  X,
  Calendar,
  Flame,
  Code,
  Target,
  Download
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground").then(mod => ({ default: mod.ThreeBackground })), {
  ssr: false,
  loading: () => null
});

const NetworkVisualization = dynamic(() => import("@/components/NetworkVisualization").then(mod => ({ default: mod.NetworkVisualization })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse" />
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LandingNavbar />

      {/* Three.js Animated Background */}
      <ThreeBackground />

      {/* Hero Section - Above the Fold */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 z-10">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Copy */}
            <div className="text-center lg:text-left">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-white">Build Skills.</span><br />
                <span className="text-white">Collaborate.</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Get Hired.</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Daily tracker, project portfolio, live coding rooms, and AI resume tools — all in one workspace.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                    Try Live Demo
                  </Button>
                </Link>
                <Link href="/mobile">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 text-lg border-white/20 hover:bg-white/5"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download App
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right - 3D Network Visual */}
            <motion.div
              className="relative h-[300px] md:h-[500px] mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                <NetworkVisualization />

                {/* Overlay label */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-1">Connected Network</h3>
                  <p className="text-sm text-gray-400">Build skills together, grow as a community</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 relative z-10 border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Problem */}
            <div>
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <X className="w-6 h-6" /> The Problem
              </h3>
              <ul className="space-y-4">
                {[
                  "Learning scattered across platforms",
                  "No consistency in daily practice",
                  "Hard to find teammates for projects",
                  "Weak resumes with no proof of work"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" /> The Solution
              </h3>
              <ul className="space-y-4">
                {[
                  "Plan daily with smart tracker",
                  "Track growth with visual tree",
                  "Collaborate on real projects",
                  "Share recruiter-ready profile"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="py-20 relative z-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Everything you need in one hub
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Execute Daily */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <Calendar className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Execute Daily</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Daily planner</li>
                <li>• Streak system</li>
                <li>• Tree growth 🌱</li>
              </ul>
            </div>

            {/* Build Together */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Build Together</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Project teams</li>
                <li>• Kanban board</li>
                <li>• Live code rooms</li>
              </ul>
            </div>

            {/* Get Hired */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <Target className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Get Hired</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Resume builder</li>
                <li>• ATS score</li>
                <li>• AI Interview prep</li>
                <li>• Competitive stats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative z-10 border-t border-white/10">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            How NexusHub Works
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { num: "1", text: "Plan today's goals", icon: Calendar },
              { num: "2", text: "Track progress → tree grows", icon: TreePine },
              { num: "3", text: "Build projects with team", icon: Users },
              { num: "4", text: "Generate resume", icon: FileText },
              { num: "5", text: "Share profile link", icon: Target }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-6 p-6 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                  {step.num}
                </div>
                <step.icon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <p className="text-xl text-gray-200">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 relative z-10">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "AI-Powered Tools",
                "Team Collaboration",
                "Portfolio Builder",
                "Career Tracking"
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative z-10 border-t border-white/10">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to level up your skills?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-12 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                Try Live Demo
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button size="lg" variant="outline" className="h-16 px-12 text-xl border-white/20 hover:bg-white/5">
                View GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10 relative z-10">
        <p>© 2024 NexusHub • Your all-in-one career growth platform</p>
      </footer>
    </div>
  );
}
