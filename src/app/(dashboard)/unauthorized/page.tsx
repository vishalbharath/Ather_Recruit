import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center text-center py-20 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive mb-6">
        <ShieldAlert className="h-8 w-8" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
        Access Denied
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-8 leading-relaxed">
        Your role lacks authorization credentials to review this area. If this is a mistake, contact your supervisor.
      </p>

      <Link
        href="/dashboard/overview"
        className="inline-flex h-9 items-center justify-center rounded-lg border border-border/40 bg-zinc-900/10 px-4 text-sm font-medium text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors gap-2 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Go back home
      </Link>
    </div>
  );
}
