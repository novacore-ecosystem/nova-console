import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";
import type { TenantDetailDto } from "@/services/tenant/types";

/** `GET /auth/tenants/{id}` — real endpoint, `tenant:view`. The full editing payload. */
export async function getTenant(id: string): Promise<TenantDetailDto> {
  const response = await httpClient.get<ApiResponse<TenantDetailDto>>(`${BASE_PATH}/${id}`);
  return unwrapApiResponse(response);
}
