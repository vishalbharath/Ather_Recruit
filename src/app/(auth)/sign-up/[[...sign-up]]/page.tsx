import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <SignUp
          appearance={{
            elements: {
              card: "bg-card border border-border/40 shadow-2xl rounded-2xl",
              headerTitle: "text-foreground font-semibold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-background border border-border text-foreground hover:bg-zinc-900",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/95",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
}
