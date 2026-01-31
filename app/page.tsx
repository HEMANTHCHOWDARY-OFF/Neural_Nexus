"use client";

import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CheckCircle,
  TreePine,
  Folder,
  FileText,
  Trophy,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
              Plan. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Grow.</span> Get Hired.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate platform to track your daily progress, build impactful projects, and land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete toolkit designed for students and professionals to accelerate their career growth.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Daily Tracker</CardTitle>
                  <CardDescription>Track your daily tasks and habits effectively.</CardDescription>
                </CardHeader>
                <CardContent>
                  Build consistency with our intuitive daily task management system.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <TreePine className="h-10 w-10 text-emerald-600 mb-2" />
                  <CardTitle>Tree Growth</CardTitle>
                  <CardDescription>Visualize your progress as a growing tree.</CardDescription>
                </CardHeader>
                <CardContent>
                  Watch your virtual tree grow as you complete tasks and maintain streaks.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <Folder className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Showcase your work and build a portfolio.</CardDescription>
                </CardHeader>
                <CardContent>
                  Organize and display your projects to impress potential recruiters.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <FileText className="h-10 w-10 text-pink-500 mb-2" />
                  <CardTitle>Resume AI</CardTitle>
                  <CardDescription>Get AI-powered feedback on your resume.</CardDescription>
                </CardHeader>
                <CardContent>
                  Optimize your resume with intelligent suggestions and formatting tools.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
                  <CardTitle>Competitive Stats</CardTitle>
                  <CardDescription>Track your coding contest ratings.</CardDescription>
                </CardHeader>
                <CardContent>
                  Integrate with LeetCode/CodeForces to show off your competitive programming skills.
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Simple steps to accelerate your career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-bold text-blue-600">1</div>
              <h3 className="text-xl font-semibold">Plan</h3>
              <p className="text-muted-foreground">Set your daily goals and long-term objectives.</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl font-bold text-purple-600">2</div>
              <h3 className="text-xl font-semibold">Grow</h3>
              <p className="text-muted-foreground">Complete tasks, build projects, and visualize your growth.</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl font-bold text-green-600">3</div>
              <h3 className="text-xl font-semibold">Get Hired</h3>
              <p className="text-muted-foreground"> Showcase your profile and portfolio to recruiters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-lg">
              Join NexusHub Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t">
        <p>© 2024 NexusHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
