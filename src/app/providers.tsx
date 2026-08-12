"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@novacore/frontend-next-shadcn";

import { createQueryClient } from "@/shared/lib/query/client";
import { AppTranslationProvider } from "@/shared/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AppTranslationProvider>
        <AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>{children}</AdminProvider>
      </AppTranslationProvider>
    </QueryClientProvider>
  );
}
