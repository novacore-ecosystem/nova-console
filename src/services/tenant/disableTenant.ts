import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

/**
 * `POST /auth/tenants/{id}/disable` — real endpoint, `tenant:manage`. Idempotent.
 * There is no corresponding enable/activate endpoint — a disabled tenant cannot be
 * re-enabled through this API today, even though the domain supports it.
 */
export async function disableTenant(id: string): Promise<void> {
  const response = await httpClient.post<ApiResponse<object>>(`${BASE_PATH}/${id}/disable`);
  unwrapApiResponse(response);
}
