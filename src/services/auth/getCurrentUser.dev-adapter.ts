import { Permissions } from "@novacore/frontend-foundation";

export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

/**
 * DEV ADAPTER — isolated by design, see docs/decisions/README.md ("Session bootstrap
 * probes refresh-token; identity/permissions are a stubbed, isolated adapter"). No
 * backend endpoint returns current-user identity or permissions (no `/me`, see
 * docs/reference/domain-mapping.md). This assumes an authenticated session implies
 * Root, since every screen in nova-console gates on Permissions.Root and the one real
 * endpoint in this domain requires it too.
 *
 * MUST be replaced with a real service call once the backend exposes a session/`/me`
 * endpoint returning actual roles/permissions — do not extend this stub with more
 * invented fields.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: "root",
    name: "Root",
    roles: ["root"],
    permissions: [Permissions.Root],
  };
}
