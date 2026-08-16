"use client";

import { useState } from "react";
import { useAdminTheme, type ThemeMode } from "@novacore/frontend-next-shadcn";

/** Appearance is the one genuinely real settings capability today (`AdminProvider`'s
 * `setThemeConfig`) — draft/save/cancel state lives here rather than applying instantly,
 * so the page demonstrates the standard settings save/cancel pattern honestly. */
export function useSettingsPage() {
  const { config, setThemeConfig } = useAdminTheme();
  const committedMode: ThemeMode = config.mode ?? "system";
  const [mode, setMode] = useState<ThemeMode>(committedMode);

  return {
    mode,
    setMode,
    isDirty: mode !== committedMode,
    save: () => setThemeConfig((prev) => ({ ...prev, mode })),
    cancel: () => setMode(committedMode),
  };
}
