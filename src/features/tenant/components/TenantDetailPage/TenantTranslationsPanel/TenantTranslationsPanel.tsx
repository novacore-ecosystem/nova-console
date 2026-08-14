"use client";

import { LOCALE_METADATA, type Locale } from "@novacore/frontend-foundation";
import {
  Button,
  DataTable,
  type DataTableColumn,
  PageSection,
  SearchInput,
  Select,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import {
  useTenantTranslationsPanel,
  type TenantTranslationRow,
} from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel/useTenantTranslationsPanel";
import { TenantTranslationEditDialog } from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel/TenantTranslationEditDialog";
import { TenantDictionaryJsonDialog } from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel/TenantDictionaryJsonDialog";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantTranslationsPanelProps {
  tenant: TenantDetailDto;
}

export function TenantTranslationsPanel({ tenant }: TenantTranslationsPanelProps) {
  const { t } = useAppTranslation();
  const {
    language,
    setLanguage,
    search,
    setSearch,
    rows,
    editingRow,
    openEdit,
    closeEdit,
    saveTranslation,
    isSaving,
    saveError,
    isJsonDialogOpen,
    openJsonDialog,
    setJsonDialogOpen,
    dictionary,
  } = useTenantTranslationsPanel(tenant);

  const columns: DataTableColumn<TenantTranslationRow>[] = [
    {
      id: "key",
      header: t("translation.table.key", "Key"),
      cell: (row) => <span className="font-mono text-xs">{row.key}</span>,
    },
    { id: "value", header: t("translation.table.value", "Value") },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row.key)}>
          {t("common.actions.edit", "Edit")}
        </Button>
      ),
    },
  ];

  return (
    <PageSection
      title={t("tenant.translations.title", "Translations")}
      description={t(
        "tenant.translations.description",
        "Merged effective dictionary served to this tenant's own application, per language.",
      )}
      actions={
        <Button variant="outline" size="sm" onClick={openJsonDialog}>
          {t("tenant.translations.editJson", "Edit as JSON")}
        </Button>
      }
    >
      <Toolbar>
        <Select
          value={language}
          onValueChange={setLanguage}
          options={tenant.supportedLanguages.map((code) => ({
            value: code,
            label: LOCALE_METADATA[code as Locale]?.nativeName ?? code,
          }))}
        />
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder={t("translation.searchPlaceholder", "Search keys or values")}
        />
      </Toolbar>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.key}
        loading={false}
        emptyMessage={t("translation.list.empty", "No keys found.")}
      />

      {editingRow ? (
        <TenantTranslationEditDialog
          key={editingRow.key}
          row={editingRow}
          isSaving={isSaving}
          saveError={saveError}
          onClose={closeEdit}
          onSave={saveTranslation}
        />
      ) : null}

      <TenantDictionaryJsonDialog
        tenantId={tenant.id}
        language={language}
        dictionary={dictionary}
        open={isJsonDialogOpen}
        onOpenChange={setJsonDialogOpen}
      />
    </PageSection>
  );
}
