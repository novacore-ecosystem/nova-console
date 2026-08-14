import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

export interface UpdateTenantInput {
  name: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

/** `PUT /auth/tenants/{id}` — real endpoint, `tenant:manage`. No `code` field — it's immutable. */
export async function updateTenant(id: string, input: UpdateTenantInput): Promise<void> {
  const response = await httpClient.put<ApiResponse<object>>(`${BASE_PATH}/${id}`, input);
  unwrapApiResponse(response);
}
