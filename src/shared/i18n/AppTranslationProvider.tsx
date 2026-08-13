"use client";

import { createContext, useMemo, type ReactNode } from "react";
import {
  createTranslator,
  TRANSLATION_RESOURCES,
  type Locale,
  type Translator,
} from "@novacore/frontend-foundation";

import { useLocaleStore } from "@/shared/stores/locale.store";
import { useTranslationOverridesStore } from "@/shared/stores/translationOverrides.store";
import { APP_DICTIONARY } from "@/shared/i18n/dictionary";

export interface AppTranslate {
  (key: string, fallback?: string, values?: Record<string, string | number>): string;
}

export const AppTranslationContext = createContext<AppTranslate | null>(null);

/**
 * Resolution chain per rules/localization.md: tenant dictionary (live overrides from
 * Translation Management, see docs/decisions/README.md — "Translation Management edits
 * the live tenant override layer directly") -> application dictionary (APP_DICTIONARY)
 * -> fallback (frontend-foundation's TRANSLATION_RESOURCES) -> explicit call-site
 * default -> the raw key as a last resort.
 */
export function AppTranslationProvider({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((state) => state.locale);
  const overridesByLocale = useTranslationOverridesStore((state) => state.overridesByLocale);

  const translate = useMemo<AppTranslate>(() => {
    const base: Translator = createTranslator(
      { tenant: overridesByLocale, application: APP_DICTIONARY, fallback: TRANSLATION_RESOURCES },
      { locale: locale as Locale, onMissingKey: "key" },
    );

    return (key, fallback, values) => {
      const resolved = base(key, values);
      return resolved === key && fallback !== undefined ? fallback : resolved;
    };
  }, [locale, overridesByLocale]);

  return (
    <AppTranslationContext.Provider value={translate}>{children}</AppTranslationContext.Provider>
  );
}
