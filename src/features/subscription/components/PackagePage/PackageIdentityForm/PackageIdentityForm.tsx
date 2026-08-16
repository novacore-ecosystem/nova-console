"use client";

import { Button, Checkbox, FormActions, FormField, Input, Select, Textarea } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import {
  usePackageIdentityForm,
  type PackageIdentityFormMode,
} from "@/features/subscription/components/PackagePage/PackageIdentityForm/usePackageIdentityForm";
import type { PackageDetailDto } from "@/services/subscription";

const NO_GROUP = "none";

export interface PackageIdentityFormProps {
  mode: PackageIdentityFormMode;
  pkg?: PackageDetailDto;
  onSuccess: (packageId: string) => void;
  onCancel?: () => void;
}

export function PackageIdentityForm({ mode, pkg, onSuccess, onCancel }: PackageIdentityFormProps) {
  const { t } = useAppTranslation();
  const {
    form,
    onSubmit,
    groups,
    tags,
    groupId,
    setGroupId,
    tagIds,
    toggleTag,
    status,
    setStatus,
    isSubmitting,
    errorMessage,
  } = usePackageIdentityForm({ mode, pkg, onSuccess });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Form form={form} onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <FormField label={t("subscription.form.name", "Name")} htmlFor="name" error={errors.name?.message}>
        <Input id="name" invalid={!!errors.name} {...register("name")} />
      </FormField>
      <FormField label={t("subscription.form.group", "Group")} htmlFor="groupId">
        <Select
          value={groupId ?? NO_GROUP}
          onValueChange={(value) => setGroupId(value === NO_GROUP ? null : value)}
          options={[
            { value: NO_GROUP, label: t("subscription.form.noGroup", "No group") },
            ...groups.map((group) => ({ value: group.id, label: group.name })),
          ]}
        />
      </FormField>
      <FormField label={t("subscription.form.tags", "Tags")}>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={tagIds.includes(tag.id)}
                onCheckedChange={(checked) => toggleTag(tag.id, checked === true)}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </FormField>
      {mode === "update" ? (
        <FormField label={t("subscription.form.status", "Status")} htmlFor="status">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as "active" | "archived")}
            options={[
              { value: "active", label: t("subscription.status.active", "Active") },
              { value: "archived", label: t("subscription.status.archived", "Archived") },
            ]}
          />
        </FormField>
      ) : null}
      <FormField
        label={t("subscription.form.description", "Description")}
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea id="description" {...register("description")} />
      </FormField>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <FormActions>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.actions.cancel", "Cancel")}
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting}>
          {mode === "insert"
            ? t("subscription.create.submit", "Create package")
            : t("subscription.edit.submit", "Save changes")}
        </Button>
      </FormActions>
    </Form>
  );
}
