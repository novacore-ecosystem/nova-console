import type { ScopeRecord } from "@/services/scope/types";

/**
 * DEV ADAPTER — isolated by design, see docs/decisions/README.md ("Scope Management is
 * scoped per-tenant, fully dev-adapter-backed"). Unlike Tenant, there is NO real
 * endpoint to seed from at all — Scope has zero backend API surface (domain model only,
 * see docs/reference/domain-mapping.md). Seed data below is entirely synthetic, not
 * derived from any real call.
 *
 * MUST be replaced with real service calls once the backend exposes Scope endpoints.
 */

export interface CreateScopeInput {
  tenantId: string;
  parentScopeId: string | null;
  code: string;
  name: string;
  description?: string | null;
}

export interface UpdateScopeInput {
  name: string;
  description?: string | null;
}

const scopesByTenant = new Map<string, ScopeRecord[]>();

function seedForTenant(tenantId: string): ScopeRecord[] {
  const seeded: ScopeRecord[] = [
    {
      id: crypto.randomUUID(),
      tenantId,
      parentScopeId: null,
      code: "hq",
      name: "Headquarters",
      description: "Root scope",
      path: "/hq",
      level: 0,
      sortOrder: 0,
      isActive: true,
    },
  ];
  scopesByTenant.set(tenantId, seeded);
  return seeded;
}

function getStore(tenantId: string): ScopeRecord[] {
  return scopesByTenant.get(tenantId) ?? seedForTenant(tenantId);
}

export async function getScopes(tenantId: string): Promise<ScopeRecord[]> {
  return getStore(tenantId);
}

export async function createScope(input: CreateScopeInput): Promise<ScopeRecord> {
  const store = getStore(input.tenantId);
  if (store.some((scope) => scope.code === input.code)) {
    throw new Error(`Scope code "${input.code}" is already in use for this tenant.`);
  }
  const parent = input.parentScopeId
    ? store.find((scope) => scope.id === input.parentScopeId)
    : undefined;
  const level = parent ? parent.level + 1 : 0;
  const path = parent ? `${parent.path}/${input.code}` : `/${input.code}`;

  const record: ScopeRecord = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    parentScopeId: input.parentScopeId,
    code: input.code,
    name: input.name,
    description: input.description ?? null,
    path,
    level,
    sortOrder: store.length,
    isActive: true,
  };
  store.push(record);
  return record;
}

export async function updateScope(
  tenantId: string,
  id: string,
  input: UpdateScopeInput,
): Promise<ScopeRecord> {
  const store = getStore(tenantId);
  const index = store.findIndex((scope) => scope.id === id);
  if (index === -1) throw new Error(`Scope "${id}" not found.`);
  const updated: ScopeRecord = {
    ...store[index],
    name: input.name,
    description: input.description ?? null,
  };
  store[index] = updated;
  return updated;
}

export async function setScopeActive(
  tenantId: string,
  id: string,
  isActive: boolean,
): Promise<ScopeRecord> {
  const store = getStore(tenantId);
  const index = store.findIndex((scope) => scope.id === id);
  if (index === -1) throw new Error(`Scope "${id}" not found.`);
  store[index] = { ...store[index], isActive };
  return store[index];
}
