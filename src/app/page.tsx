import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Dynamic graphic glowing orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <header className="flex h-16 w-full items-center justify-between px-6 md:px-12 border-b border-border/40 relative z-10 backdrop-blur-sm bg-background/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-semibold text-foreground tracking-tight text-lg">
            Aether
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/overview"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer"
          >
            Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 py-24 md:py-32">
        <div className="max-w-3xl flex flex-col items-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary tracking-wide">
            Introducing Aether Recruiter Workspace v1.0
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1] max-w-2xl font-display">
            The intelligent recruitment board for scaling teams.
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
            Organize candidates, coordinate schedules, and track interview feedback in a unified dashboard built for fast-moving startups.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <Link
              href="/overview"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20"
            >
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/40 bg-zinc-900/10 dark:bg-zinc-800/10 px-6 text-sm font-medium text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border/40 text-xs text-muted-foreground relative z-10 bg-background/30 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Aether Inc. All rights reserved.
      </footer>
    </div>
  );
}
