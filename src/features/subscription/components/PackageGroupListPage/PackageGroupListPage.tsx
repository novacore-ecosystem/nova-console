"use client";

import { AdminBreadcrumb, Button, ConfirmDialog, PageContainer, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { GroupTable } from "@/features/subscription/components/PackageGroupListPage/GroupTable";
import { GroupFormDialog } from "@/features/subscription/components/PackageGroupListPage/GroupFormDialog";
import { usePackageGroupListPage } from "@/features/subscription/components/PackageGroupListPage/usePackageGroupListPage";

export function PackageGroupListPage() {
  const { t } = useAppTranslation();
  const {
    groups,
    isLoading,
    isCreateOpen,
    openCreate,
    setCreateOpen,
    editingGroup,
    openEdit,
    closeEdit,
    deletingGroup,
    openDelete,
    closeDelete,
    confirmDelete,
    isDeleting,
    deleteError,
  } = usePackageGroupListPage();

  return (
    <PageContainer>
      <PageHeader
        title={t("subscription.group.title", "Package groups")}
        description={t("subscription.group.description", "Organize packages by business domain/capability.")}
        breadcrumb={
          <AdminBreadcrumb
            items={[
              { label: t("subscription.list.title", "Packages"), href: "/subscriptions" },
              { label: t("subscription.group.title", "Package groups") },
            ]}
          />
        }
        actions={<Button onClick={openCreate}>{t("subscription.group.newGroup", "New group")}</Button>}
      />
      <GroupTable groups={groups} loading={isLoading} onEdit={openEdit} onDelete={openDelete} />

      <GroupFormDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
      {editingGroup ? (
        <GroupFormDialog key={editingGroup.id} group={editingGroup} open onOpenChange={closeEdit} />
      ) : null}

      <ConfirmDialog
        open={!!deletingGroup}
        onOpenChange={(open) => !open && closeDelete()}
        title={t("subscription.group.deleteTitle", "Delete group?")}
        description={t(
          "subscription.group.deleteDescription",
          "Packages in this group become ungrouped. This cannot be undone.",
        )}
        confirmLabel={t("common.actions.delete", "Delete")}
        confirmVariant="destructive"
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
