"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import type { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
