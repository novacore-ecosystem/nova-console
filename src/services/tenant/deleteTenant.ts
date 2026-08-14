import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

/** `DELETE /auth/tenants/{id}` — real endpoint, `tenant:manage`. Soft delete — distinct from disable, irreversible through this API. */
export async function deleteTenant(id: string): Promise<void> {
  const response = await httpClient.delete<ApiResponse<object>>(`${BASE_PATH}/${id}`);
  unwrapApiResponse(response);
}
