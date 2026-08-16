"use client";

import type { Permission } from "@novacore/frontend-foundation";
import { Button, Checkbox, EmptyState, SearchInput, SkeletonList } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { usePermissionScopeSelector } from "@/shared/authorization/PermissionScopeSelector/usePermissionScopeSelector";

export interface PermissionScopeSelectorProps {
  /** The full catalog the caller is choosing from — e.g. `PERMISSION_VALUES`, or a caller-narrowed subset. */
  availablePermissions: readonly Permission[];
  /** Currently granted keys — fully controlled, reflected back via `onChange`. */
  grantedKeys: readonly string[];
  /** Keys outside the caller's own scope — shown for context, never selectable. */
  disabledKeys?: readonly string[];
  onChange: (next: string[]) => void;
  loading?: boolean;
  saving?: boolean;
  dirty?: boolean;
  error?: string | null;
}

/**
 * Reusable Root → Tenant → Tenant-users authorization control (see docs brief: a tenant
 * can only ever be granted from what's passed in `availablePermissions`, minus
 * `disabledKeys`). No tenant-specific or otherwise caller-specific data lives inside this
 * component — everything comes in as props, everything goes out via `onChange`.
 */
export function PermissionScopeSelector({
  availablePermissions,
  grantedKeys,
  disabledKeys = [],
  onChange,
  loading,
  saving,
  dirty,
  error,
}: PermissionScopeSelectorProps) {
  const { t } = useAppTranslation();
  const { search, setSearch, groups, toggleKey, toggleGroup, selectAllVisible, deselectAllVisible } =
    usePermissionScopeSelector({ availablePermissions, grantedKeys, disabledKeys, onChange });

  if (loading) return <SkeletonList rows={6} />;

  const interactionDisabled = saving;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder={t("authorization.permissionScope.searchPlaceholder", "Search permissions")}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={selectAllVisible} disabled={interactionDisabled}>
          {t("authorization.permissionScope.selectAll", "Select all")}
        </Button>
        <Button variant="outline" size="sm" onClick={deselectAllVisible} disabled={interactionDisabled}>
          {t("authorization.permissionScope.deselectAll", "Deselect all")}
        </Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          {saving ? (
            <span>{t("authorization.permissionScope.saving", "Saving…")}</span>
          ) : dirty ? (
            <span>{t("authorization.permissionScope.dirty", "Unsaved changes")}</span>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {groups.length === 0 ? (
        <EmptyState
          description={t("authorization.permissionScope.empty", "No permissions match your search.")}
        />
      ) : (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-3">
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Checkbox
                  checked={group.checked}
                  disabled={interactionDisabled}
                  onCheckedChange={(checked) => toggleGroup(group, checked === true)}
                />
                {group.label}
                <span className="font-normal text-muted-foreground">
                  ({group.permissions.filter((row) => grantedKeys.includes(row.key)).length}/
                  {group.permissions.length})
                </span>
              </label>
              <div className="ml-6 flex flex-col gap-1">
                {group.permissions.map((row) => (
                  <label
                    key={row.key}
                    className="flex items-center gap-2 text-sm text-muted-foreground data-[disabled]:opacity-50"
                    data-disabled={row.disabled || undefined}
                  >
                    <Checkbox
                      checked={grantedKeys.includes(row.key)}
                      disabled={interactionDisabled || row.disabled}
                      onCheckedChange={(checked) => toggleKey(row.key, checked === true)}
                    />
                    {row.label}
                    <span className="font-mono text-xs">{row.key}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
