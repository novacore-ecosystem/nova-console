/**
 * DEV ADAPTER — isolated by design, mirrors the pattern in `services/scope/scope.dev-adapter.ts`
 * (see docs/decisions/README.md). Unlike Scope, there isn't even a backend **domain model**
 * for "permissions granted to a tenant" — the backend only has the flat global Permissions
 * catalog plus Role CRUD (see docs/reference/domain-mapping.md: "no Tenant or Scope keys
 * exist" refers to the catalog itself, and there's no separate grant/scope entity either).
 * This is a purely frontend-forward construct — the UI-only half of the Root → Tenant
 * permission-scope rule — until/unless the backend adds a real tenant-permission-grant
 * entity and endpoints. MUST be replaced with real service calls at that point.
 */

const grantsByTenant = new Map<string, string[]>();

export async function getTenantPermissionScope(tenantId: string): Promise<string[]> {
  return grantsByTenant.get(tenantId) ?? [];
}

export async function setTenantPermissionScope(tenantId: string, keys: string[]): Promise<string[]> {
  const unique = [...new Set(keys)];
  grantsByTenant.set(tenantId, unique);
  return unique;
}
