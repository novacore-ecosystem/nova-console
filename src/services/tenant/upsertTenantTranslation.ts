import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

export interface UpsertTenantTranslationInput {
  language: string;
  key: string;
  value: string;
}

/**
 * `PUT /auth/tenants/{id}/translations` — real endpoint, `tenant:manage`. Key-level
 * upsert into one language's dictionary — merges a single key/value, preserving every
 * other key.
 */
export async function upsertTenantTranslation(id: string, input: UpsertTenantTranslationInput): Promise<void> {
  const response = await httpClient.put<ApiResponse<object>>(`${BASE_PATH}/${id}/translations`, input);
  unwrapApiResponse(response);
}
