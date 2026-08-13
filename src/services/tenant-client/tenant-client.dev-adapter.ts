import type { TenantClientRecord } from "@/services/tenant-client/types";

/**
 * DEV ADAPTER — isolated by design, see docs/decisions/README.md ("TenantClient
 * management is split: a Tenant detail tab plus a top-level Security page"). Zero
 * backend endpoints exist for TenantClient at all — domain + persistence only, no
 * CQRS/Application/API layer wired yet (see docs/reference/domain-mapping.md).
 *
 * MUST be replaced with real service calls once the backend exposes TenantClient
 * endpoints — do not extend this with more invented backend behavior.
 */

export interface CreateTenantClientInput {
  tenantId: string | null;
  name: string;
}

function generatePublicKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const records: TenantClientRecord[] = [];

export async function getTenantClients(tenantId: string | null): Promise<TenantClientRecord[]> {
  return records.filter((record) => record.tenantId === tenantId);
}

/** Returns the full record, including the plaintext key — display it once, never persist it. */
export async function createTenantClient(
  input: CreateTenantClientInput,
): Promise<TenantClientRecord> {
  const record: TenantClientRecord = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    name: input.name,
    publicKey: generatePublicKey(),
    status: "active",
    expiresAt: null,
    revokedAt: null,
    revokedReason: null,
  };
  records.push(record);
  return record;
}

/** Revokes the existing record and creates a fresh one with a new key — the caller displays the new key once. */
export async function rotateTenantClient(id: string): Promise<TenantClientRecord> {
  const existing = records.find((record) => record.id === id);
  if (!existing) throw new Error(`TenantClient "${id}" not found.`);
  existing.status = "revoked";
  existing.revokedAt = new Date().toISOString();
  existing.revokedReason = "rotated";

  const rotated: TenantClientRecord = {
    id: crypto.randomUUID(),
    tenantId: existing.tenantId,
    name: existing.name,
    publicKey: generatePublicKey(),
    status: "active",
    expiresAt: null,
    revokedAt: null,
    revokedReason: null,
  };
  records.push(rotated);
  return rotated;
}

export async function revokeTenantClient(id: string, reason: string): Promise<TenantClientRecord> {
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) throw new Error(`TenantClient "${id}" not found.`);
  records[index] = {
    ...records[index],
    status: "revoked",
    revokedAt: new Date().toISOString(),
    revokedReason: reason,
  };
  return records[index];
}
