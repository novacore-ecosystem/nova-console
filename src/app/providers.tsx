"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider, NOVACORE_ADMIN_THEME } from "@novacore/frontend-next-shadcn";

import { createQueryClient } from "@/shared/lib/query/client";
import { AppTranslationProvider } from "@/shared/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AppTranslationProvider>
        {/* NovaCore Admin design baseline — see docs/reference/design-system.md.
            nova-console is the Root/Core Administration product; a future admin
            product overrides only `color` (e.g. `{ ...NOVACORE_ADMIN_THEME, color: "blue" }`). */}
        <AdminProvider theme={{ ...NOVACORE_ADMIN_THEME, mode: "system" }}>{children}</AdminProvider>
      </AppTranslationProvider>
    </QueryClientProvider>
  );
}
