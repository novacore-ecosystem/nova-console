/** Mirrors Auth.Domain's TenantClient entity — a client-identification credential (X-Tenant-Client-Key), NOT a signing/certificate key. See docs/reference/domain-mapping.md. */
export type TenantClientStatus = "active" | "revoked" | "expired";

export interface TenantClientRecord {
  id: string;
  tenantId: string | null;
  name: string;
  publicKey: string;
  status: TenantClientStatus;
  expiresAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
}
