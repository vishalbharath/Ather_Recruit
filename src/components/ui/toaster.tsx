"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast, Toast } from "@/lib/toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={cn(
              "flex items-start gap-3 w-full p-4 rounded-xl border backdrop-blur-md shadow-lg",
              t.type === "success" && "bg-green-500/10 border-green-500/20 text-green-400",
              t.type === "error" && "bg-destructive/10 border-destructive/20 text-destructive",
              t.type === "info" && "bg-zinc-950/90 border-border/40 text-foreground"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {t.type === "info" && <Info className="h-5 w-5 flex-shrink-0" />}
            
            <p className="text-xs font-medium flex-1 pt-0.5 leading-relaxed">{t.message}</p>
            
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
