"use client";

import { AdminBreadcrumb, Button, ConfirmDialog, PageContainer, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TagTable } from "@/features/subscription/components/PackageTagListPage/TagTable";
import { TagFormDialog } from "@/features/subscription/components/PackageTagListPage/TagFormDialog";
import { usePackageTagListPage } from "@/features/subscription/components/PackageTagListPage/usePackageTagListPage";

export function PackageTagListPage() {
  const { t } = useAppTranslation();
  const {
    tags,
    isLoading,
    isCreateOpen,
    openCreate,
    setCreateOpen,
    editingTag,
    openEdit,
    closeEdit,
    deletingTag,
    openDelete,
    closeDelete,
    confirmDelete,
    isDeleting,
    deleteError,
  } = usePackageTagListPage();

  return (
    <PageContainer>
      <PageHeader
        title={t("subscription.tag.title", "Package tags")}
        description={t("subscription.tag.description", "Used for classification, filtering, and discovery.")}
        breadcrumb={
          <AdminBreadcrumb
            items={[
              { label: t("subscription.list.title", "Packages"), href: "/subscriptions" },
              { label: t("subscription.tag.title", "Package tags") },
            ]}
          />
        }
        actions={<Button onClick={openCreate}>{t("subscription.tag.newTag", "New tag")}</Button>}
      />
      <TagTable tags={tags} loading={isLoading} onEdit={openEdit} onDelete={openDelete} />

      <TagFormDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
      {editingTag ? <TagFormDialog key={editingTag.id} tag={editingTag} open onOpenChange={closeEdit} /> : null}

      <ConfirmDialog
        open={!!deletingTag}
        onOpenChange={(open) => !open && closeDelete()}
        title={t("subscription.tag.deleteTitle", "Delete tag?")}
        description={t("subscription.tag.deleteDescription", "Packages tagged with it lose the tag. This cannot be undone.")}
        confirmLabel={t("common.actions.delete", "Delete")}
        confirmVariant="destructive"
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
