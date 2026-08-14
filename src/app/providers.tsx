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
        <AdminProvider
          theme={{
            preset: "zinc-blue",
            mode: "system",
            // Deep Indigo (#4338CA) — the Root/Identity/Control Plane brand color, applied
            // strategically via primary/ring only (see docs/decisions/README.md and the task
            // brief's "Indigo" section). The rest of the UI stays neutral zinc.
            overrides: {
              primary: "244 58% 51%",
              "primary-foreground": "0 0% 98%",
              ring: "244 58% 51%",
            },
          }}
        >
          {children}
        </AdminProvider>
      </AppTranslationProvider>
    </QueryClientProvider>
  );
}
