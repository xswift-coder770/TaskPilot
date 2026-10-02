import React from "react";
import { Link } from "react-router-dom";
import {
  Kanban,
  CheckCircle2,
  FileText,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { BrandLogo } from "../components/common/BrandLogo";
import { APP_NAME } from "../utils/constants";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const features = [
    {
      icon: Kanban,
      title: "Interactive Kanban Boards",
      description:
        "Manage tasks across Todo, In-Progress, and Done states with custom attachments and status sync.",
      color:
        "text-amber-500 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-900",
    },
    {
      icon: CheckCircle2,
      title: "Granular Subtasks",
      description:
        "Deconstruct large tasks into manageable checklists with independent completion toggles.",
      color:
        "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-900",
    },
    {
      icon: FileText,
      title: "Project Notes",
      description:
        "Maintain essential architectural notes, roadmaps, and requirements directly in each workspace.",
      color: "text-sky-500 bg-sky-50 dark:bg-sky-950/50 dark:border-sky-900",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Invite team members via email and distribute responsibilities with real-time updates.",
      color:
        "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 dark:border-indigo-900",
    },
    {
      icon: Shield,
      title: "3-Tier Role Access Control",
      description:
        "Role permissions for Admin, Project Admin, and Member protect your workspace data.",
      color:
        "text-purple-500 bg-purple-50 dark:bg-purple-950/50 dark:border-purple-900",
    },
    {
      icon: Sparkles,
      title: "Automated JWT Auth",
      description:
        "Secure session management with silent token refresh interceptors and fast response times.",
      color:
        "text-rose-500 bg-rose-50 dark:bg-rose-950/50 dark:border-rose-900",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 h-16 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <BrandLogo to="/" />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-all"
            >
              <span>Dashboard (@{user?.username})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Your copilot for productive teams</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage projects, tasks, and teams with{" "}
            <span className="text-teal-600 dark:text-teal-400">
              TaskPilot.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            TaskPilot provides Kanban boards, subtasks, collaborative notes, and
            role-based permissions to keep your team aligned.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 shadow-md transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 shadow-md transition-all"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 text-left"
                >
                  <div
                    className={`inline-flex p-3 rounded-lg border ${feature.color} mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
