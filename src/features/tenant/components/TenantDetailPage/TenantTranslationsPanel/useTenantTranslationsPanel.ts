"use client";

import { useMemo, useState } from "react";
import type { TranslationDictionary } from "@novacore/frontend-foundation";

import { flattenDictionary } from "@/shared/i18n";
import { useUpsertTenantTranslationMutation } from "@/features/tenant/api/tenant.queries";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantTranslationRow {
  key: string;
  value: string;
}

function isDictionary(value: unknown): value is TranslationDictionary {
  return typeof value === "object" && value !== null;
}

export function useTenantTranslationsPanel(tenant: TenantDetailDto) {
  const [language, setLanguage] = useState(tenant.supportedLanguages[0] ?? "en");
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isJsonDialogOpen, setJsonDialogOpen] = useState(false);

  const upsertMutation = useUpsertTenantTranslationMutation(tenant.id);

  const dictionary = tenant.translations[language]?.dictionary;

  const rows = useMemo<TenantTranslationRow[]>(() => {
    const flat = isDictionary(dictionary) ? flattenDictionary(dictionary) : {};
    const term = search.trim().toLowerCase();
    return Object.entries(flat)
      .map(([key, value]) => ({ key, value }))
      .filter((row) => !term || row.key.toLowerCase().includes(term) || row.value.toLowerCase().includes(term))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [dictionary, search]);

  const editingRow = rows.find((row) => row.key === editingKey) ?? null;

  const saveTranslation = async (value: string) => {
    if (!editingKey) return;
    await upsertMutation.mutateAsync({ language, key: editingKey, value });
    setEditingKey(null);
  };

  return {
    language,
    setLanguage,
    search,
    setSearch,
    rows,
    editingRow,
    openEdit: (key: string) => setEditingKey(key),
    closeEdit: () => setEditingKey(null),
    saveTranslation,
    isSaving: upsertMutation.isPending,
    saveError: upsertMutation.error instanceof Error ? upsertMutation.error.message : null,
    isJsonDialogOpen,
    openJsonDialog: () => setJsonDialogOpen(true),
    setJsonDialogOpen,
    dictionary,
  };
}
