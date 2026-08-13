"use client";

import { LOCALE_METADATA, type Locale } from "@novacore/frontend-foundation";
import {
  PageContainer,
  SearchInput,
  Select,
  ShellPageHeader,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TranslationTable } from "@/features/translation/components/TranslationBrowserPage/TranslationTable";
import { TranslationEditDialog } from "@/features/translation/components/TranslationBrowserPage/TranslationEditDialog";
import { TRANSLATION_LOCALES } from "@/features/translation/translation.catalog";
import { useTranslationBrowserPage } from "@/features/translation/components/TranslationBrowserPage/useTranslationBrowserPage";

export function TranslationBrowserPage() {
  const { t } = useAppTranslation();
  const {
    locale,
    setLocale,
    search,
    setSearch,
    rows,
    editingRow,
    openEdit,
    closeEdit,
    saveOverride,
    resetOverride,
  } = useTranslationBrowserPage();

  return (
    <PageContainer>
      <ShellPageHeader
        title={t("translation.title", "Localization")}
        description={t("translation.description", "Browse and override translation values.")}
      />
      <Toolbar>
        <Select
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
          options={TRANSLATION_LOCALES.map((code) => ({
            value: code,
            label: LOCALE_METADATA[code].nativeName,
          }))}
        />
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder={t("translation.searchPlaceholder", "Search keys or values")}
        />
      </Toolbar>
      <TranslationTable rows={rows} onEdit={openEdit} onReset={resetOverride} />
      {editingRow ? (
        <TranslationEditDialog
          key={editingRow.key}
          row={editingRow}
          onClose={closeEdit}
          onSave={saveOverride}
        />
      ) : null}
    </PageContainer>
  );
}
