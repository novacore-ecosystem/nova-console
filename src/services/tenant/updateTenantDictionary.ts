import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

/**
 * `PUT /auth/tenants/{id}/dictionary/{language}` — real endpoint, `tenant:manage`. Bulk
 * merge-update of one language's whole dictionary JSON; unspecified keys are preserved,
 * other languages are untouched.
 */
export async function updateTenantDictionary(id: string, language: string, dictionary: unknown): Promise<void> {
  const response = await httpClient.put<ApiResponse<object>>(
    `${BASE_PATH}/${id}/dictionary/${encodeURIComponent(language)}`,
    dictionary,
  );
  unwrapApiResponse(response);
}
