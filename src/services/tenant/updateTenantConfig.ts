import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

/**
 * `PUT /auth/tenants/{id}/config` — real endpoint, `tenant:manage`. Merge-updates one
 * locale's opaque configuration JSON; unspecified keys are preserved. Omit `language`
 * to target the tenant-wide fallback/default configuration.
 */
export async function updateTenantConfig(id: string, language: string | null, config: unknown): Promise<void> {
  const response = await httpClient.put<ApiResponse<object>>(`${BASE_PATH}/${id}/config`, config, {
    query: { language: language || undefined },
  });
  unwrapApiResponse(response);
}
