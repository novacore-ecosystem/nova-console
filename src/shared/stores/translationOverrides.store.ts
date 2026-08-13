import { create } from "zustand";
import type { Locale } from "@novacore/frontend-foundation";

interface TranslationOverridesState {
  overridesByLocale: Partial<Record<Locale, Record<string, string>>>;
  setOverride: (locale: Locale, key: string, value: string) => void;
  clearOverride: (locale: Locale, key: string) => void;
}

/**
 * The `tenant` layer of the app translator's resolution chain (highest priority) — see
 * rules/localization.md and docs/decisions/README.md ("Translation Management edits
 * the live tenant override layer directly"). Global client state with nothing fetched,
 * so this is the one feature that skips TanStack Query — see rules/state-and-data.md.
 */
export const useTranslationOverridesStore = create<TranslationOverridesState>((set) => ({
  overridesByLocale: {},
  setOverride: (locale, key, value) =>
    set((state) => ({
      overridesByLocale: {
        ...state.overridesByLocale,
        [locale]: { ...state.overridesByLocale[locale], [key]: value },
      },
    })),
  clearOverride: (locale, key) =>
    set((state) => {
      const current = { ...state.overridesByLocale[locale] };
      delete current[key];
      return { overridesByLocale: { ...state.overridesByLocale, [locale]: current } };
    }),
}));
