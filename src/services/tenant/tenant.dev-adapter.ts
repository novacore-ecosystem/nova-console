import type { TenantSummaryDto } from "@/services/tenant/types";

/**
 * DEV ADAPTER — isolated by design, see docs/decisions/README.md ("Tenant Management
 * reads real data, mutates through a seeded in-memory adapter"). Tenant create/update/
 * activate/deactivate/get-by-id have no backend endpoint (see
 * docs/reference/domain-mapping.md). This in-memory store is seeded once from the real
 * `GET /auth/tenants` response so reads stay grounded in real data; writes are
 * session-local only and do not persist.
 *
 * MUST be replaced with real service calls once the backend exposes Tenant CRUD
 * endpoints — do not extend this with more invented backend behavior.
 */

export interface TenantRecord extends TenantSummaryDto {
  faviconUrl: string | null;
}

export interface CreateTenantInput {
  code: string;
  name: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

export interface UpdateTenantInput {
  name: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

let store: TenantRecord[] | null = null;

function requireStore(): TenantRecord[] {
  if (!store) throw new Error("Tenant adapter not seeded — call seedTenants() first.");
  return store;
}

/** Seeds the adapter from a real `listTenants()` response. Idempotent — a second call is a no-op. */
export function seedTenants(tenants: TenantSummaryDto[]): void {
  if (store) return;
  store = tenants.map((tenant) => ({ ...tenant, faviconUrl: null }));
}

export function isSeeded(): boolean {
  return store !== null;
}

export async function getTenants(): Promise<TenantRecord[]> {
  return requireStore();
}

export async function getTenantById(id: string): Promise<TenantRecord | null> {
  return requireStore().find((tenant) => tenant.id === id) ?? null;
}

export async function createTenant(input: CreateTenantInput): Promise<TenantRecord> {
  const records = requireStore();
  if (records.some((tenant) => tenant.code === input.code)) {
    throw new Error(`Tenant code "${input.code}" is already in use.`);
  }
  const record: TenantRecord = {
    id: crypto.randomUUID(),
    code: input.code,
    name: input.name,
    logoUrl: input.logoUrl ?? null,
    faviconUrl: input.faviconUrl ?? null,
    isActive: true,
  };
  records.push(record);
  return record;
}

export async function updateTenant(id: string, input: UpdateTenantInput): Promise<TenantRecord> {
  const records = requireStore();
  const index = records.findIndex((tenant) => tenant.id === id);
  if (index === -1) throw new Error(`Tenant "${id}" not found.`);
  const updated: TenantRecord = {
    ...records[index],
    name: input.name,
    logoUrl: input.logoUrl ?? null,
    faviconUrl: input.faviconUrl ?? null,
  };
  records[index] = updated;
  return updated;
}

export async function setTenantActive(id: string, isActive: boolean): Promise<TenantRecord> {
  const records = requireStore();
  const index = records.findIndex((tenant) => tenant.id === id);
  if (index === -1) throw new Error(`Tenant "${id}" not found.`);
  records[index] = { ...records[index], isActive };
  return records[index];
}
