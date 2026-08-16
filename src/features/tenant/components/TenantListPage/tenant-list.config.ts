import { CriteriaOperators } from "@novacore/frontend-foundation";
import type { FilterFieldConfig, SortFieldConfig } from "@novacore/frontend-next-shadcn";

/**
 * Drives `AdvancedFilter`/`AdvancedSort`/`ColumnVisibility` on the Tenant list — the
 * reference "enterprise list page" for this design system pass. `field` values must match
 * `TenantSummaryDto`'s own property names exactly (`applyCriteriaFilters`/
 * `applyCriteriaSorts` read `row[field]` directly).
 */
export const TENANT_FILTER_FIELDS: FilterFieldConfig[] = [
  { field: "name", label: "Name", type: "string", operators: [CriteriaOperators.Contains, CriteriaOperators.Eq, CriteriaOperators.StartsWith] },
  { field: "code", label: "Code", type: "string", operators: [CriteriaOperators.Contains, CriteriaOperators.Eq, CriteriaOperators.StartsWith] },
  { field: "isActive", label: "Status", type: "boolean", operators: [CriteriaOperators.Eq] },
];

export const TENANT_SORT_FIELDS: SortFieldConfig[] = [
  { field: "name", label: "Name", quickSort: true },
  { field: "code", label: "Code", quickSort: true },
  { field: "isActive", label: "Status", quickSort: false },
];

export const TENANT_COLUMNS = [
  { id: "code", label: "Code" },
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
];
