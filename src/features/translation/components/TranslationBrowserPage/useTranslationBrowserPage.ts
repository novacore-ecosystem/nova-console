"use client";

import { useMemo, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@novacore/frontend-foundation";

import { useTranslationOverridesStore } from "@/shared/stores/translationOverrides.store";
import { getTranslationCatalog } from "@/features/translation/translation.catalog";

export interface TranslationRow {
  key: string;
  baseValue: string;
  overrideValue: string | null;
}

export function useTranslationBrowserPage() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE as Locale);
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const overridesByLocale = useTranslationOverridesStore((state) => state.overridesByLocale);
  const setOverride = useTranslationOverridesStore((state) => state.setOverride);
  const clearOverride = useTranslationOverridesStore((state) => state.clearOverride);

  const rows = useMemo<TranslationRow[]>(() => {
    const overrides = overridesByLocale[locale] ?? {};
    const catalog = getTranslationCatalog(locale);
    const term = search.trim().toLowerCase();

    return catalog
      .map((entry) => ({
        key: entry.key,
        baseValue: entry.baseValue,
        overrideValue: overrides[entry.key] ?? null,
      }))
      .filter(
        (row) =>
          !term ||
          row.key.toLowerCase().includes(term) ||
          row.baseValue.toLowerCase().includes(term) ||
          (row.overrideValue ?? "").toLowerCase().includes(term),
      );
  }, [locale, search, overridesByLocale]);

  const editingRow = rows.find((row) => row.key === editingKey) ?? null;

  return {
    locale,
    setLocale,
    search,
    setSearch,
    rows,
    editingRow,
    openEdit: (key: string) => setEditingKey(key),
    closeEdit: () => setEditingKey(null),
    saveOverride: (value: string) => {
      if (editingKey) setOverride(locale, editingKey, value);
      setEditingKey(null);
    },
    resetOverride: (key: string) => clearOverride(locale, key),
  };
}
