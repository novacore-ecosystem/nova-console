import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";
import type { TenantClientRotationDto } from "@/services/tenant/types";

/**
 * `POST /auth/tenants/{id}/client/rotate` — real endpoint, `tenant:rotate-client`.
 * Revokes every currently-active client for the tenant and issues one new one —
 * a tenant-level action, not a per-client one. The new key is returned once.
 */
export async function rotateTenantClient(id: string, name?: string): Promise<TenantClientRotationDto> {
  const response = await httpClient.post<ApiResponse<TenantClientRotationDto>>(`${BASE_PATH}/${id}/client/rotate`, {
    name: name || null,
  });
  return unwrapApiResponse(response);
}
