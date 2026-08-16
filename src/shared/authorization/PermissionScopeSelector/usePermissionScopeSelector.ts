"use client";

import { useMemo, useState } from "react";
import type { Permission } from "@novacore/frontend-foundation";

import { humanizePermissionKey } from "@/shared/authorization/humanizePermissionKey";

export interface PermissionScopeSelectorRow {
  key: string;
  label: string;
  disabled: boolean;
}

export interface PermissionScopeSelectorGroup {
  id: string;
  label: string;
  permissions: PermissionScopeSelectorRow[];
  checked: boolean | "indeterminate";
}

export interface UsePermissionScopeSelectorArgs {
  availablePermissions: readonly Permission[];
  grantedKeys: readonly string[];
  disabledKeys: readonly string[];
  onChange: (next: string[]) => void;
}

export function usePermissionScopeSelector({
  availablePermissions,
  grantedKeys,
  disabledKeys,
  onChange,
}: UsePermissionScopeSelectorArgs) {
  const [search, setSearch] = useState("");
  const grantedSet = useMemo(() => new Set(grantedKeys), [grantedKeys]);
  const disabledSet = useMemo(() => new Set(disabledKeys), [disabledKeys]);

  const groups = useMemo<PermissionScopeSelectorGroup[]>(() => {
    const byModule = new Map<string, string[]>();
    for (const permission of availablePermissions) {
      const { moduleId } = humanizePermissionKey(permission);
      const list = byModule.get(moduleId) ?? [];
      list.push(permission);
      byModule.set(moduleId, list);
    }

    const term = search.trim().toLowerCase();

    return [...byModule.entries()]
      .map(([moduleId, permissions]) => {
        const moduleLabel = humanizePermissionKey(`${moduleId}:`).moduleLabel;
        const moduleMatches = !term || moduleLabel.toLowerCase().includes(term);
        const rows: PermissionScopeSelectorRow[] = permissions
          .map((key) => ({
            key,
            label: humanizePermissionKey(key).label,
            disabled: disabledSet.has(key),
          }))
          .filter((row) => moduleMatches || row.label.toLowerCase().includes(term));

        const grantedCount = rows.filter((row) => grantedSet.has(row.key)).length;
        const checked: boolean | "indeterminate" =
          rows.length === 0
            ? false
            : grantedCount === rows.length
              ? true
              : grantedCount === 0
                ? false
                : "indeterminate";

        return { id: moduleId, label: moduleLabel, permissions: rows, checked };
      })
      .filter((group) => group.permissions.length > 0);
  }, [availablePermissions, disabledSet, grantedSet, search]);

  const toggleKey = (key: string, checked: boolean) => {
    const next = new Set(grantedKeys);
    if (checked) next.add(key);
    else next.delete(key);
    onChange([...next]);
  };

  const toggleGroup = (group: PermissionScopeSelectorGroup, checked: boolean) => {
    const next = new Set(grantedKeys);
    for (const row of group.permissions) {
      if (row.disabled) continue;
      if (checked) next.add(row.key);
      else next.delete(row.key);
    }
    onChange([...next]);
  };

  // Scoped to what's currently visible (post-search) so "select all" is predictable while filtering.
  const selectAllVisible = () => {
    const next = new Set(grantedKeys);
    for (const group of groups) {
      for (const row of group.permissions) {
        if (!row.disabled) next.add(row.key);
      }
    }
    onChange([...next]);
  };

  const deselectAllVisible = () => {
    const visibleKeys = new Set(groups.flatMap((group) => group.permissions.map((row) => row.key)));
    onChange(grantedKeys.filter((key) => !visibleKeys.has(key)));
  };

  return { search, setSearch, groups, toggleKey, toggleGroup, selectAllVisible, deselectAllVisible };
}
