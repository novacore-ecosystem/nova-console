const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  /**
   * The Root TenantClient's public key (X-Tenant-Client-Key header, see
   * docs/reference/domain-mapping.md). Identifies "this is the Root console," not a
   * user credential — TenantClient.PublicKey is generated server-side, never
   * user-supplied, and has no rotation flow yet. Still deployment config, not a
   * per-user secret; safe to embed client-side.
   */
  rootClientKey: process.env.NEXT_PUBLIC_ROOT_CLIENT_KEY ?? "",
} as const;
